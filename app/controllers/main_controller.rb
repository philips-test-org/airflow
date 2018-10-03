class MainController < ApplicationController
  before_filter :get_entity_manager
  before_filter :general_authentication
  before_filter :check_for_resource_groups
  after_filter :log_usage_data, :except => :exam_info
  after_filter :close_entity_manager

  def index
    @employee = Java::HarbingerSdkData::Employee.withUserName(session[:username],@entity_manager)
    @groupings = ResourceGroup.resource_group_hash(@entity_manager)
    @resourceGroups = ResourceGroup.resource_group_hash(@entity_manager).to_json
    # Reset resource group if the group doesn't exist
    if session[:resource_group] and @groupings[session[:resource_group]] == nil
      session[:resource_group] = nil
    end

    @selected = session[:resource_group] || @groupings.keys.first
  end

  def about
  end

  def help
  end

end
