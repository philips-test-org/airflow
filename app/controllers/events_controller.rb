class EventsController < ApplicationController
  before_filter :get_entity_manager
  before_filter :general_authentication
  after_filter :close_entity_manager


  def add
    employee = Java::HarbingerSdkData::Employee.withUserName(session[:username],@entity_manager)
    event = ExamAdjustment.add_event(params,employee)
    payload = OrmConverter.exams([Java::HarbingerSdkData::RadExam.withId(event.exam_adjustment.rad_exam_id,@entity_manager)],@entity_manager).first
    routing_key = "#{event.event_type}.#{event.employee_id}.#{payload['id']}.#{payload['resource_id']}"
    Harbinger::Rails::Extensions::Messaging.send_application_message("airflow",routing_key,payload.to_json)
    render :json => event
  end

end
