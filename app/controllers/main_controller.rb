class MainController < ApplicationController
  before_filter :get_entity_manager
  before_filter :general_authentication
  before_filter :get_employee
  before_filter :check_for_resource_groups
  after_filter :log_usage_data, :except => :exam_info
  after_filter :close_entity_manager

  def index
    groupings = ResourceGroup.resource_group_hash(@entity_manager)
    @resourceGroups = groupings.to_json
    @selected = selected_resources_group(groupings)
  end

  def about
  end

  def help
  end

end
