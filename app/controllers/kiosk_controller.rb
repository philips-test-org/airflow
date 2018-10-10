class KioskController < ApplicationController
  before_filter :get_entity_manager
  before_filter :check_for_resource_groups
  after_filter :log_usage_data, :except => :exam_info
  after_filter :close_entity_manager

  def index
    session[:resource_group] = params[:resource_group]
    groupings = ResourceGroup.resource_group_hash(@entity_manager)
    @resourceGroups = groupings.to_json
    @selected = selected_resources_group(groupings)
  end

  def exams
    date ||= Time.now
    orders = Exam.fetch(@entity_manager, params[:resource_ids], date)
    render :json => OrmConverter.limited_orders(orders,@entity_manager)
  end
end
