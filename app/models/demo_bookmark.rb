class DemoBookmark < ActiveRecord::Base
  self.table_name = "vanilla_demo_bookmarks"

  def initialize(ops)
    @identifier = opts[:identifier]
    @rad_exam_id = ops[:rad_exam_id]
  end
end
