class PersonsController < ApplicationController
  include HarbingerSdkFilters

  def exams
    exams = Exam.fetch_exams_with_person_id(@entity_manager, params[:id].to_i)
    completed_exams = exams.select {|e| e.rad_exam_time.end_exam.present? && e.imageViewer.present?}
    render :json => OrmConverter.rad_exams(completed_exams, @entity_manager)
  end

  def events
    patient_mrn_id = params[:id].to_i

    events = ExamEvent
              .joins(:exam_adjustment)
              .joins("JOIN public.orders orders on airflow_exam_adjustments.order_id = orders.id")
              .where("orders.patient_mrn_id = ?", patient_mrn_id)
              .where("airflow_exam_adjustments.created_at >= ?", 5.days.ago)
              .order(created_at: :desc)
    events = events.map {|event|
      expanded_event = event.expanded_attributes(@entity_manager)
      order = Java::HarbingerSdkData::Order.withId(event.exam_adjustment.order_id, @entity_manage)
      expanded_event["orderNumber"] = order.order_number
      expanded_event
    }
    render json: events
  end
end

