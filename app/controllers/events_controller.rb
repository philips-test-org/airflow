class EventsController < ApplicationController
  before_filter :get_entity_manager
  before_filter :general_authentication
  after_filter :close_entity_manager


  def add
    employee = Java::HarbingerSdkData::Employee.withUserName(session[:username],@entity_manager)
    binding.pry
    event = ExamAdjustment.add(params,employee)
    render :json => event
  end

end
