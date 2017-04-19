class ExamAdjustment < ActiveRecord::Base
  self.table_name = "airflow_exam_adjustments"
  has_many :exam_events, :foreign_key => "exam_adjustment_id"

  def self.info_for(exam)
    adj = self.where(rad_exam_id: exam.getId).first
    if adj
      events = adj.exam_events
      { :adjusted => adj.adjusted_attributes,
        :events => events.collect {|e| e.attributes } }
    else
      {:adjusted => {}, :events => []}
    end
  end

  def self.update_location(params)
    adjusted = {
      "start_time" => params[:adjusted][:start_time],
      "stop_time" => params[:adjusted][:stop_time],
      "resource_id" => params[:adjusted][:resource_id]
    }
    self.iou(params[:id],adjusted)
  end

  def self.iou(rad_exam_id,adjusted)
    ea = self.find_by_rad_exam_id(rad_exam_id)
    if ea
      aa = ea.adjusted_attributes.merge(adjusted)
      ea.update_attribute(:adjusted_attributes,aa.to_json)
      ea
    else
      self.create({:rad_exam_id => rad_exam_id, :adjusted_attributes => adjusted.to_json})
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
