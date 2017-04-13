class ExamAdjustment < ActiveRecord::Base
  self.table_name = "airflow_exam_adjustments"
  has_many :exam_events, :foreign_key => "exam_adjustment_id"

  def self.info_for(exam)
    adj = self.where(rad_exam_id: exam.getId).first
    if adj
      events = adj.exam_events
      { :adjusted => adj,
        :events => events.collect {|e| e.attributes } }
    else
      {:adjusted => {}, :events => []}
    end
  end

end
