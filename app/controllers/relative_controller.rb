class RelativeController < ApplicationController
  before_filter :get_entity_manager
  before_filter :general_authentication
  after_filter :close_entity_manager


  def index
    test_exams
  end

  def test_exams
    # test ids
    irlabids = ["UMIRLAB1","UMIRLAB2","UMIRLAB3","UMIRLAB4","UMIRLAB5","UMIRLAB6","UMIRLAB7","UMRF1","UMRF2","UMRF3"]
    q = Java::HarbingerSdkData::RadExam.createQuery(@entity_manager)
    q.where([q.in(".resource.resource",irlabids),
             q.between(".radExamTime.beginExam",
                       Time.parse("2017-01-19").beginning_of_day,
                       Time.parse("2017-01-19").end_of_day)])
    exams = q.list
    # Terrible grouper, do not use!
    @exams = exams.inject([]) {|list,exam| list.find {|e| e.resourceId == exam.resourceId && e.patientMrn == exam.patientMrn && e.startTime == exam.startTime } ? nil : list << exam; list }
    @resources = @exams.group_by(&:resource)
  end

end
