class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_filter :check_session_username

  def get_entity_manager
    @entity_manager ||= Java::HarbingerSdk::DataUtils.getEntityManager
  end

  def close_entity_manager
    @entity_manager.close if !@entity_manager.nil?
  end

  def general_authentication
    respond_to do |format|
      format.html do
        authenticate_and_authorize(SiteConfiguration.get_clinical_roles_for_key("clinical_roles_auth_list"))
      end

      # If request is JSON and the user is no longer authenticated, send JSON back stating this
      # So that React and use that to redirect the user to login
      format.json do
        if !valid_token?
          render json: {
            error: "Not authenticated",
            authenticated: false
          }
        else
          authenticate_and_authorize(SiteConfiguration.get_clinical_roles_for_key("clinical_roles_auth_list"))
        end
      end
    end
  end

  def mananger_authentication
    auth_wrapper(SiteConfiguration.get_clinical_roles_for_key("manager_roles_auth_list")) {|roles| authenticate_and_authorize(roles) }
  end

  def check_session_username
    return if valid_token?
    session.delete(:username)
  end

  def valid_token?
    token_cookie_name = get_cookie_name_for_token
    token_cookie = get_token_cookie(token_cookie_name)
    valid_token_test = Java::harbinger.sdk.SSO.valid_token(token_cookie)
  end

  def selected_resources_group(groupings)
    # Reset resource group if the group doesn't exist
    if session[:resource_group] and groupings[session[:resource_group]] == nil
      session[:resource_group] = nil
    end

    session[:resource_group] || groupings.keys.first
  end


  def get_employee
    @employee ||= Java::HarbingerSdkData::Employee.withUserName(session[:username],@entity_manager)
  end

  def is_support
    authenticate_and_authorize(["it-staff","ai-staff"])
  end

  def check_for_resource_groups
    return if !session[:username] || ResourceGroup.any?

    redirect_to resource_groups_url, alert: "You must add at least one resource group"
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

  private

  def auth_wrapper(role_list=[])
    if role_list.empty?
      redirect_to :unauthorized
    else
      yield role_list
    end
  end
end
