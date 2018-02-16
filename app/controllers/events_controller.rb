class EventsController < ApplicationController
  before_filter :get_entity_manager
  before_filter :general_authentication
  after_filter :log_usage_data
  after_filter :close_entity_manager

  def create
    employee = Java::HarbingerSdkData::Employee.withUserName(session[:username],@entity_manager)
    event = ExamAdjustment.add_event(params,employee)
    payload = OrmConverter.orders([Java::HarbingerSdkData::Order.withId(event.exam_adjustment.order_id,@entity_manager)],@entity_manager).first
    routing_key = "#{event.event_type}.#{event.employee_id}.#{payload['id']}.#{payload['resource_id']}"
    Harbinger::Rails::Extensions::Messaging.send_application_message("airflow",routing_key,payload.to_json)

    respond_to do |format|
      format.json {render json: event_with_employee(event, employee).to_json}
    end
  end

  private

  def event_with_employee(event, employee)
    e = event.attributes.clone
    e[:employee] = OrmConverter.attributes(employee)
    e[:new_state] = JSON.parse(event.new_state)
    e
  end
end
