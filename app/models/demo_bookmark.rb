class DemoBookmark < ActiveRecord::Base
  self.table_name = "vanilla_demo_bookmarks"

  def rad_exam
    #TODO use FK relationship
    @rad_exam ||= Java::HarbingerSdkData::RadExam.withId(self.rad_exam_id)
  end
end
