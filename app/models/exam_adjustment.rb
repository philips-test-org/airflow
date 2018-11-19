class ExamAdjustment < ActiveRecord::Base
  self.table_name = "airflow_exam_adjustments"
  has_many :exam_events, :foreign_key => "exam_adjustment_id", :dependent => :destroy

  def self.info_for(order_hash, em)
    adj = self.where(order_id: order_hash["id"]).first
    if adj
      adjusted_start = adj.adjusted_attributes["start_time"] ? Time.at(adj.adjusted_attributes["start_time"] / 1000).to_date : nil
      ost = Exam.start_time(order_hash)
      original_start = Time.at(ost / 1000).to_date

      # Only use adjusted attributes if the adjusted start time's date is the same as the original
      if adjusted_start.present? && adjusted_start != original_start
        adjusted_attrs = adj.adjusted_attributes.slice("start_time", "stop_time", "resource_id")
      else
        adjusted_attrs = adj.adjusted_attributes
      end
      events = adj.exam_events

      { :adjusted => adjusted_attrs || [],
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
    ea = self.find_by_order_id(params[:order_id])
    if ea
      aa = ea.adjusted_attributes.merge(params[:event][:new_state])
      ea.update_attribute(:adjusted_attributes,aa.to_json)
      ea
    else
      self.create({:order_id => params[:order_id], :adjusted_attributes => params[:event][:new_state].to_json})
    end
  end

  def self.ios(params)
    ea = self.find_by_order_id(params[:order_id])
    if ea
      ea
    else
      ea.create({:order_id => params[:order_id]})
    end
  end

  def adjusted_attributes
    JSON.parse(self.attributes['adjusted_attributes'])
  end

end
