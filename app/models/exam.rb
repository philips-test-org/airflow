class Exam
  def self.fetch(em, resource_ids, date)
    q = Java::HarbingerSdkData::Order.createQuery(em)
    q.join(".currentStatus.universalEventType")
    q.where([q.or([q.in(".resourceId", resource_ids),
                   q.in(".radExams.resourceId", resource_ids)]),
             q.and([q.or([q.notEqual(".currentStatus.universalEventType.eventType", "cancelled"),
                          q.isNull(".currentStatus.universalEventTypeId")
                         ]),
                    q.or([q.notEqual(".radExams.currentStatus.universalEventType.eventType", "cancelled"),
                          q.isNull(".radExams.currentStatus.universalEventTypeId")])]),
             q.or([q.between(".radExams.radExamTime.appointment",
                             date.beginning_of_day,
                             date.end_of_day),
                   q.between(".radExams.radExamTime.beginExam",
                             date.beginning_of_day,
                             date.end_of_day),
                   q.between(".appointment", date.beginning_of_day,date.end_of_day)])
            ])
    q.order(".orderNumber asc")
    q.criteria.distinct(true)
    q.list
  end
end
