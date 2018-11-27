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

  def self.fetch_exams_with_person_id(em, person_id)
    patient = Java::HarbingerSdkData::Patient.withId(person_id, em)
    patient.radExams
  end

  def self.start_time(order_hash)
    # Check if order has an exam
    if order_hash[:rad_exam]
      begin_exam = order_hash.dig(:rad_exam, :rad_exam_time, "begin_exam")
      if begin_exam
        # Use exam begin_exam if its there
        return begin_exam
      else
        # Otherwise use appointment time
        return order_hash.dig(:rad_exam, :rad_exam_time, "appointment")
      end
    end

    # Last resort use order appointment
    order_hash["appointment"]
  end
end
