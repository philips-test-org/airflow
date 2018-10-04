module ExamHelper
  def name(order)
    name = order.dig(:patient_mrn, :patient, "name")
    return nil unless name
    return name.split("^").reject { |word| word.nil? }.join(", ")
  end

  def procedure(order)
    return checkExamThenOrder(order, [:procedure, "description"])
  end

  def checkExamThenOrder(order, path)
    exam = order.dig(*path.clone.unshift(:rad_exam))
    return exam unless exam.nil?
    return order.dig(*path)
  end

  def rounding(order)
    events = checkExamThenOrder(order, [:events])
    return "N/A" if events.nil? or events.empty?
    roundingEvent = events.find { |event| event["event_type"] == "rounding-update" }
    return roundingEvent.nil? ? "N/A" : roundingEvent["comments"]
  end

  def orderingPhysician(order)
    ordering = order.dig(:ordering_provider, "name")
    exam = order.dig(:rad_exam, :rad_exam_personnel, :ordering, "name")
    exam.nil? ? ordering : exam
  end

  def start_time(order)
    # Use adjusted time if its there
    examAdjustment = ExamAdjustment.find_by(order_id: order["id"])
    if examAdjustment
      start_time = examAdjustment.adjusted_attributes["start_time"]
      if start_time.present?
        return start_time
      end
    end

    if order[:rad_exam]
      begin_exam = order.dig(:rad_exam, :rad_exam_time, "begin_exam")
      if begin_exam
        # Use rad exam time if its there
        return begin_exam
      else
        # Otherwise use appointment time
        return order.dig(:rad_exam, :rad_exam_time, "appointment")
      end
    end
    
    order["appointment"]
  end
end
