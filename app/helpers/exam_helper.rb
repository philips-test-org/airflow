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
    checkExamThenOrder(order, [:rad_exam_personnel, :ordering, "name"])
  end
end
