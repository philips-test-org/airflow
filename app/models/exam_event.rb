class ExamEvent < ActiveRecord::Base
  self.table_name = "airflow_exam_events"
  belongs_to :exam_adjustment, foreign_key: "exam_adjustment_id"
end
