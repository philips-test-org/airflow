class ExamEvent < ActiveRecord::Base
  self.table_name = "airflow_exam_events"
  belongs_to :exam_adjustment, foreign_key: "exam_adjustment_id"

  def expanded_attributes(em)
    attrs = self.attributes.clone
    attrs["employee"] = OrmConverter.attributes(Java::HarbingerSdkData::Employee.withId(attrs["employee_id"],em))
    attrs["new_state"] = JSON.parse(attrs["new_state"])
    attrs.delete("employee_id")
    attrs
  end

end
