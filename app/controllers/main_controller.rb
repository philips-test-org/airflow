class MainController < ApplicationController
  before_filter :general_authentication
  before_filter :get_entity_manager
  after_filter :close_entity_manager

  def index
    query = Java::HarbingerSdkData::RadExam.createQuery(@entity_manager)
    query.where([query.equal(".siteClass.ed",true),query.greaterThan(".radExamTime.endExam",1.day.ago.to_time)])
    @exams = query.order(".radExamTime.endExam desc").list()
  end

  def about
  end

end
