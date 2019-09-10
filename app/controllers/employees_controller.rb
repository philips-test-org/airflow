class EmployeesController < ApplicationController
  include HarbingerSdkFilters

  def current
    @employee ||= Java::HarbingerSdkData::Employee.withUserName(session[:username],@entity_manager)
    emp_data = JSON.parse(@employee.to_json).merge({"language" => employee_locale})
    render json: emp_data
  end
end
