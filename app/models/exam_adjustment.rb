class ExamAdjustment < ActiveRecord::Base
  self.table_name = "airflow_exam_adjustments"
  has_many :exam_events, :foreign_key => "exam_adjustment_id", :dependent => :destroy

  def self.info_for(exam,em)
    adj = self.where(rad_exam_id: exam.getId).first
    if adj
      events = adj.exam_events
      { :adjusted => adj.adjusted_attributes,
        :events => events.collect {|e| e.expanded_attributes(em) } }
    else
      {:adjusted => {}, :events => []}
    end
  end

  def self.add_event(params,employee)
    ea = self.iou(params)
    event_attributes = {
      :new_state => params[:event][:new_state].to_json,
      :comments => params[:event][:comments],
      :event_type => params[:event][:event_type],
      :exam_adjustment_id => ea.id,
      :employee_id => employee.id}
    ExamEvent.create(event_attributes)
  end

  def self.iou(params)
    ea = self.find_by_rad_exam_id(params[:id])
    if ea
      aa = ea.adjusted_attributes.merge(params[:event][:new_state])
      ea.update_attribute(:adjusted_attributes,aa.to_json)
      ea
    else
      self.create({:rad_exam_id => params[:id], :adjusted_attributes => params[:event][:new_state].to_json})
    end
  end

  def self.ios(params)
    ea = self.find_by_rad_exam_id(params[:id])
    if ea
      ea
    else
      ea.create({:rad_exam_id => params[:id]})
    end
  end

  def adjusted_attributes
    JSON.parse(self.attributes['adjusted_attributes'])
  end

end
