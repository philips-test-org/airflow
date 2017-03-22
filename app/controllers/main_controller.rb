class MainController < ApplicationController
  before_filter :get_entity_manager
  before_filter :general_authentication
  after_filter :close_entity_manager

  def index
    @employee = Java::HarbingerSdkData::Employee.withUserName(session[:username],@entity_manager)
    q = Java::HarbingerSdkData::Resource.createQuery(@entity_manager)
    q.where(q.in(".resource",["UMIRLAB1","UMIRLAB2","UMIRLAB3","UMIRLAB4","UMIRLAB5","UMIRLAB6","UMIRLAB7","UMRF1","UMRF2","UMRF3"]))
    resources = q.list.to_a
    # Will become configurable and use ids instead of resource names
    @groupings = {"IR 1" => OrmConverter.resources(resources)}
  end

  def exams
    @irlabids = ["UMIRLAB1","UMIRLAB2","UMIRLAB3","UMIRLAB4","UMIRLAB5","UMIRLAB6","UMIRLAB7","UMRF1","UMRF2","UMRF3"]
    q = Java::HarbingerSdkData::RadExam.createQuery(@entity_manager)
    q.where([q.in(".resource.resource",@irlabids),
             # q.equal(".resource.modality.modality","CT"),
             q.between(".radExamTime.beginExam",
                       Time.parse("2017-01-19").beginning_of_day,
                       Time.parse("2017-01-19").end_of_day)])
    exams = q.list
    render :json => OrmConverter.exams(exams)
  end

  def exam
    render :json => OrmConverter.exam_modal(Java::HarbingerSdkData::RadExam.withId(params[:id].to_i,@entity_manager))
  end

  def about
  end

  def help
  end

end
