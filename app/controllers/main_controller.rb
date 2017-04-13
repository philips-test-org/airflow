class MainController < ApplicationController
  before_filter :get_entity_manager
  before_filter :general_authentication
  after_filter :close_entity_manager

  def index
    @employee = Java::HarbingerSdkData::Employee.withUserName(session[:username],@entity_manager)
    q = Java::HarbingerSdkData::Resource.createQuery(@entity_manager)
    q.where(q.in(".resource",["VHC Trauma CT-1", "VHC Trauma CT-2", "VHC Main CT-2", "VHC Main CT-3", "VHO-CT CT-1", "VHO-CT CT-2", "VHO-CT CT-3", "VHS-2 TRAUMA", "VHC Main CT-1"]))
    resources = q.list.to_a

    q = Java::HarbingerSdkData::Resource.createQuery(@entity_manager)
    q.where(q.in(".resource",["VHC MR-1", "VHC MR-2", "VHC MR-3","VHO-MR MR-1", "VHO-MR MR-2", "VHO-MR MR-3"]))
    resources2 = q.list.to_a

    # Will become configurable and use ids instead of resource names
    @groupings = {"CT" => OrmConverter.resources(resources), "MR" => OrmConverter.resources(resources2)}
  end

  def exams
    q = Java::HarbingerSdkData::RadExam.createQuery(@entity_manager)
    q.where([q.in(".resourceId",params[:resource_ids]),
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

  def kiosk
    q = Java::HarbingerSdkData::Resource.createQuery(@entity_manager)
    q.where(q.in(".resource",["VHC Trauma CT-1", "VHC Trauma CT-2", "VHC Main CT-2", "VHC Main CT-3", "VHO-CT CT-1", "VHO-CT CT-2", "VHO-CT CT-3", "VHS-2 TRAUMA", "VHC Main CT-1"]))
    resources = q.list.to_a

    q = Java::HarbingerSdkData::Resource.createQuery(@entity_manager)
    q.where(q.in(".resource",["VHC MR-1", "VHC MR-2", "VHC MR-3","VHO-MR MR-1", "VHO-MR MR-2", "VHO-MR MR-3"]))
    resources2 = q.list.to_a

    # Will become configurable and use ids instead of resource names
    @groupings = {"CT" => OrmConverter.resources(resources), "MR" => OrmConverter.resources(resources2)}
  end

  def about
  end

  def help
  end

end
