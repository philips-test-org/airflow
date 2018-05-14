class PersonsController < ApplicationController
  include HarbingerSdkFilters

  def exams
    exams = Exam.fetch_exams_with_person_id(@entity_manager, params[:id].to_i)
    completed_exams = exams.select {|e| e.rad_exam_time.end_exam.present? && e.imageViewer.present?}
    render :json => OrmConverter.rad_exams(completed_exams, @entity_manager)
  end
end

