class MainController < ApplicationController
  before_filter :get_entity_manager
  before_filter :general_authentication
  after_filter :log_usage_data, :except => :exam_info
  after_filter :close_entity_manager

  def index
    @employee = Java::HarbingerSdkData::Employee.withUserName(session[:username],@entity_manager)
    @groupings = ResourceGroup.resource_group_hash(@entity_manager)
  end

  def exams
    date = Time.at(params[:date].to_i) unless params[:date].blank?
    date ||= Time.now
    q = Java::HarbingerSdkData::Order.createQuery(@entity_manager)
    q.where([q.or([q.in(".resourceId",params[:resource_ids]),
                   q.in(".radExams.resourceId",params[:resource_ids])]),
             # q.equal(".resource.modality.modality","CT"),
             q.or([q.notEqual(".currentStatus.universalEventType.eventType","cancelled"),
                   q.notEqual(".radExams.currentStatus.universalEventType.eventType","cancelled")]),
             q.or([q.or([q.between(".radExams.radExamTime.appointment",
                                   date.beginning_of_day,
                                   date.end_of_day),
                         q.between(".radExams.radExamTime.beginExam",
                                   date.beginning_of_day,
                                   date.end_of_day)])]),
             q.between(".appointment",date.beginning_of_day,date.end_of_day)
            ])
    q.order(".orderNumber asc")
    orders = q.list
    log_hipaa_view(exams)
    render :json => OrmConverter.orders(orders,@entity_manager)
  end

  def exam_info
    exam = Java::HarbingerSdkData::RadExam.withId(params[:id].to_i,@entity_manager)
    q = Java::HarbingerSdkData::RadExam.createQuery(@entity_manager)
    filters = [q.notEqual(".id",exam.getId),
               q.equal(".patientMrnId",exam.patient_mrn_id),
               q.equal(".resourceId",exam.resource_id),]
    if exam.radExamTime and exam.radExamTime.beginExam
      filters << q.equal(".radExamTime.beginExam",exam.radExamTime.beginExam)
    else
      filters << q.equal(".radExamTime.appointment",exam.radExamTime.appointment)
    end
    q.where(filters)
    others = q.list().to_a
    log_hipaa_view([exam] + others)
    render :json => OrmConverter.exams([exam] + others,@entity_manager)
  end

  def exam
    render :json => OrmConverter.exam_modal(Java::HarbingerSdkData::RadExam.withId(params[:id].to_i,@entity_manager))
  end

  def about
  end

  def help
  end

end
