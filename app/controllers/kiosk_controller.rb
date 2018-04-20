class KioskController < ApplicationController
  before_filter :get_entity_manager
  after_filter :log_usage_data, :except => :exam_info
  after_filter :close_entity_manager

  def index
    session[:resource_group] = params[:resource_group]
    @groupings = ResourceGroup.resource_group_hash(@entity_manager)
  end

  def exams
    date ||= Time.now
    orders = Exam.fetch(@entity_manager, params[:resource_ids], date)
    render :json => OrmConverter.limited_orders(orders,@entity_manager)
  end
end
