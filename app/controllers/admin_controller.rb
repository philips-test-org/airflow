class AdminController < ApplicationController
  before_filter :is_support
  before_filter :get_entity_manager
  before_filter :get_employee
  after_filter :close_entity_manager

  def site_configuration
    @config = SiteConfiguration.get_configuration
    @site_config = @config
    query = Java::HarbingerSdkData::ClinicalRole.createQuery(@entity_manager)
    @all_clinical_roles = query.select(".clinicalRole").list.to_a
  end

  def save_config
    options = params

    if SiteConfiguration.update_configuration(session[:username],options)
      respond_to do |format|
        format.json { render json: { configuration: SiteConfiguration.get_configuration, updated_by: SiteConfiguration.get_username, updated_at: SiteConfiguration.get_configuration_time } }
      end
    else
      respond_to do |format|
        format.json { render json: {status: "Failed to updated configuration"}, status: 500 }
      end
    end

  end

end
