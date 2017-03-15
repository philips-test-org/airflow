module ApplicationHelper

  def format_name(string)
    string.gsub("^",", ")
  end

  ## Card size calculation
  def pixels_per_second
    # pixels given / 60 minutes / 60 seconds
    200.0 / 60.0 / 60.0
  end

  def exam_height(exam)
    seconds = Time.parse(exam.stopTime.to_s) - Time.parse(exam.startTime.to_s)
    (seconds * pixels_per_second).round
  end

  def exam_top(exam)
    t = Time.parse(exam.startTime.to_s)
    ((t.hour * 60 * 60 + t.min * 60 + t.sec) * pixels_per_second).round
  end

  # Set color (temp rip from SU)
  def set_color_by_study(exam)
    if issue_or_delay?(exam)
      "#ff8800"
    elsif not exam.radExamTime.begin_exam and exam.radExamTime.appointment
      "#57dee8"
    elsif exam.siteClass and exam.siteClass.trauma
      "#ff51eb"
    elsif exam.siteClass and exam.siteClass.ed
      "#9315c1"
    elsif exam.siteClass and exam.siteClass.patientType and (exam.siteClass.patientType.patient_type == "I" or (exam.siteClass.patientType.patient_type == "O" and exam.radExamTime and exam.radExamTime.begin_exam and Time.parse(exam.radExamTime.begin_exam.toString).hour >= 21))
      "#398cc4"
    elsif exam.radExamTime and exam.radExamTime.schedule_event and exam.radExamTime.begin_exam and Time.parse(exam.radExamTime.schedule_event.toString).midnight == Time.parse(exam.radExamTime.begin_exam.toString).midnight
      "#3000ff"
    elsif exam.siteClass and exam.siteClass.patientType and exam.siteClass.patientType.patient_type == "O"
      "#53a790"
    else
      "#f5f52b"
    end
  end

  def issue_or_delay?(exam)
    #delays = study.with_group.collect {|s| s.issues.size > 0 or (s.delay_reason and not s.delay_reason.reason.blank?) }
    #delays.include?(true)
    exam.rad_exam_detail.delay_reason ? true : false
  end

end
