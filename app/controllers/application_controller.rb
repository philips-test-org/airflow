class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def get_entity_manager
    @entity_manager ||= Java::HarbingerSdk::DataUtils.getEntityManager
  end

  def close_entity_manager
    @entity_manager.close if !@entity_manager.nil?
  end

  def general_authentication
    authenticate()
  end

  def get_employee
    @employee ||= Java::HarbingerSdkData::Employee.withUserName(session[:username],@entity_manager)
  end

  def is_support
    authenticate_and_authorize(["it-staff","ai-staff"])
  end

  # Takes a list of ORM objects (rad_exams, or patient_mrns, but NOT rad_exams and patient_mrns)
  # and does the HIPAA auditing.
  def log_hipaa_view(objects,options={})
    if objects.size > 0
      options.reverse_merge!({
          :app_name => "airflow",
          :request_info => request.original_fullpath,
          :requesting_ip => request.remote_ip,
          :table_name => objects.first.class.table_name,
          :username => session[:username],
          :domain => session[:domain] || "not set in session",
          :table_ids => objects.collect {|exam| exam.id }
        })
      objects.compact! if objects.class == Array
      Java::HarbingerSdk.Hipaa.explicitLogger(
                               options[:app_name],
                               options[:request_info],
                               options[:requesting_ip],
                               options[:username],
                               options[:domain],
                               options[:table_name],
                               options[:table_ids])
    end
  end

end
