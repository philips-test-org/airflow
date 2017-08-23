class MainController < ApplicationController
  before_filter :get_entity_manager
  before_filter :general_authentication
  after_filter :log_usage_data, :except => :exam_info
  after_filter :close_entity_manager

  def index
    @employee = Java::HarbingerSdkData::Employee.withUserName(session[:username],@entity_manager)
    @groupings = ResourceGroup.resource_group_hash(@entity_manager)
    # Reser resource group if the group doesn't exist
    if session[:resource_group] and @groupings[session[:resource_group]] == nil
      session[:resource_group] = nil
    end
  end

  def exams
    session[:resource_group] = params[:resource_group]
    date = Time.at(params[:date].to_i) unless params[:date].blank?
    date ||= Time.now
    q = Java::HarbingerSdkData::Order.createQuery(@entity_manager)
    q.join(".currentStatus.universalEventType")
    q.where([q.or([q.in(".resourceId",params[:resource_ids]),
                   q.in(".radExams.resourceId",params[:resource_ids])]),
             q.and([q.or([q.notEqual(".currentStatus.universalEventType.eventType","cancelled"),
                          q.isNull(".currentStatus.universalEventTypeId")
                         ]),
                    q.or([q.notEqual(".radExams.currentStatus.universalEventType.eventType","cancelled"),
                          q.isNull(".radExams.currentStatus.universalEventTypeId")])]),
             q.or([q.between(".radExams.radExamTime.appointment",
                             date.beginning_of_day,
                             date.end_of_day),
                   q.between(".radExams.radExamTime.beginExam",
                             date.beginning_of_day,
                             date.end_of_day),
                   q.between(".appointment",date.beginning_of_day,date.end_of_day)])
            ])
    q.order(".orderNumber asc")
    q.criteria.distinct(true)
    orders = q.list
    log_hipaa_view(orders)
    render :json => OrmConverter.orders(orders,@entity_manager)
  end

  def exam_info
    if params[:table] == "orders"
      order = Java::HarbingerSdkData::Order.withId(params[:id].to_i,@entity_manager)
      if order.resourceId.blank? or order.appointment.blank?
        all = [order, order.master_order].compact.uniq
      else
        q = Java::HarbingerSdkData::Order.createQuery(@entity_manager)
        q.where([q.notEqual(".id",order.getId),
                 q.equal(".patientMrnId",order.patient_mrn_id),
                 q.equal(".resourceId",order.resource_id),
                 q.equal(".appointment",order.appointment)])
        all = q.list.to_a.inject([]) {|list,o| list + [o,o.master_order] }.compact.uniq
      end
    else
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
      all = [exam] + others
      all.collect! {|e| e.order }
      all.uniq!
    end
    log_hipaa_view(all)
    render :json => OrmConverter.orders(all,@entity_manager)
  end

  # def exam
  #   render :json => OrmConverter.exam_modal(Java::HarbingerSdkData::RadExam.withId(params[:id].to_i,@entity_manager))
  # end

  def about
  end

  def help
  end

end
