class EmployeesController < ApplicationController
  include HarbingerSdkFilters

  def current
    @employee ||= Java::HarbingerSdkData::Employee.withUserName(session[:username],@entity_manager)
    render json: @employee.to_json
  end
end
