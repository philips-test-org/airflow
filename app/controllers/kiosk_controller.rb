class MainController < ApplicationController
  before_filter :get_entity_manager
  before_filter :general_authentication
  after_filter :close_entity_manager

  def index
    @groupings = ResourceGroup.resource_group_hash(@entity_manager)
  end

  def exams
    date = Time.at(params[:date].to_i) unless params[:date].blank?
    date ||= Time.now
    q = Java::HarbingerSdkData::RadExam.createQuery(@entity_manager)
    q.where([q.in(".resourceId",params[:resource_ids]),
             # q.equal(".resource.modality.modality","CT"),
             q.notEqual(".currentStatus.universalEventType.eventType","cancelled"),
             q.or([q.between(".radExamTime.appointment",
                             date.beginning_of_day,
                             date.end_of_day),
                   q.between(".radExamTime.beginExam",
                             date.beginning_of_day,
                             date.end_of_day)])
            ])
    exams = q.list
    log_hipaa_view(exams)
    render :json => OrmConverter.limited_exams(exams,@entity_manager)
  end


end
