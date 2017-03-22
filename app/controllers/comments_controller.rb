class CommentsController < ApplicationController
  before_filter :get_entity_manager
  before_filter :general_authentication
  after_filter :close_entity_manager


  def create
    employee = Java::HarbingerSdkData::Employee.withUserName(session[:username],@entity_manager)
    render :json => OrmConverter.exam_with_comment(employee,params[:comments])
  end

end
