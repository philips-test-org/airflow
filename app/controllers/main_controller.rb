class MainController < ApplicationController
  before_filter :get_entity_manager
  before_filter :general_authentication
  after_filter :log_usage_data, :except => :exam_info
  after_filter :close_entity_manager

  def index
    @employee = Java::HarbingerSdkData::Employee.withUserName(session[:username],@entity_manager)
    @groupings = ResourceGroup.resource_group_hash(@entity_manager)
    # Reset resource group if the group doesn't exist
    if session[:resource_group] and @groupings[session[:resource_group]] == nil
      session[:resource_group] = nil
    end
  end

  def about
  end

  def help
  end

end
