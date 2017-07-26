class KioskController < ApplicationController
  before_filter :get_entity_manager
  after_filter :log_usage_data, :except => :exam_info
  after_filter :close_entity_manager

  def index
    @groupings = ResourceGroup.resource_group_hash(@entity_manager)
  end

  def exam_info
    date ||= Time.now
    date = Time.parse("2015-11-27")
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
    render :json => OrmConverter.limited_orders(orders,@entity_manager)
  end


end
