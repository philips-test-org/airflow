class ExamsController < ApplicationController
  include HarbingerSdkFilters

  def index
    session[:resource_group] = params[:resource_group]
    resource_ids = params[:resource_ids] || all_resource_group_ids()
    date = Time.at(params[:date].to_i) unless params[:date].blank?
    date ||= Time.now
    orders = Exam.fetch(@entity_manager, resource_ids, date)
    log_hipaa_view(orders)

    render :json => OrmConverter.orders(orders,@entity_manager)
  end

  def by_resource
  end

  def show
    if params[:table] == "orders"
      order = Java::HarbingerSdkData::Order.withId(params[:id].to_i,@entity_manager)
      if order.resourceId.blank? or order.appointment.blank?
        all = [order, order.master_order].compact.uniq
      else
        q = Java::HarbingerSdkData::Order.createQuery(@entity_manager)
        q.where([q.equal(".patientMrnId",order.patient_mrn_id),
                 q.equal(".resourceId",order.resource_id),
                 q.equal(".appointment",order.appointment)])
        all = q.list.to_a.inject([]) {|list,o| list + [o,o.master_order] }.compact.uniq
      end
    else
      exam = Java::HarbingerSdkData::RadExam.withId(params[:id].to_i,@entity_manager)
      q = Java::HarbingerSdkData::RadExam.createQuery(@entity_manager)
      filters = [q.equal(".patientMrnId",exam.patient_mrn_id),
                 q.equal(".resourceId",exam.resource_id),]
      if exam.radExamTime and exam.radExamTime.beginExam
        filters << q.equal(".radExamTime.beginExam",exam.radExamTime.beginExam)
      else
        filters << q.equal(".radExamTime.appointment",exam.radExamTime.appointment)
      end
      q.where(filters)
      others = q.list().to_a
      all = [exam] + others
      all.collect! {|e| e.order }
      all.uniq!
    end
    log_hipaa_view(all)

    render :json => OrmConverter.orders(all,@entity_manager)
  end

  def print_view
    resource_ids = params[:resources].map(&:to_i)
    resource_group = params[:resource_group]
    resources = ResourceGroup.resource_group_hash(@entity_manager)[resource_group]
    date = params[:date].blank? ? Time.now : Time.at(params[:date].to_i / 1000)
    orders = Exam.fetch(@entity_manager, resource_ids, date)
    log_hipaa_view(orders)
    @resources = resource_name_map(resources)
    @resourceOrders = OrmConverter.print_orders(orders, @entity_manager).group_by { |order| resource_id(order) }
  end

  private

  def resource_id(order)
    # Use resource id from adjustment if it's there
    examAdjustment = ExamAdjustment.find_by(order_id: order["id"])
    if examAdjustment
      resource_id = examAdjustment.adjusted_attributes["resource_id"]
      if resource_id.present?
        return resource_id
      end
    end

    # Use resource id from rad exam if it's there
    resource_id = order.dig(:rad_exam, "resource_id")
    if resource_id.present?
      return resource_id
    end

    order["resource_id"]
  end

  def all_resource_group_ids
    ResourceGroup.resource_group_hash(@entity_manager).map {|k,v| v.map {|x| x["id"]}}.flatten.uniq
  end

  def resource_name_map(resources)
    resources.reduce({}) {|acc, resource| acc[resource["id"]] = resource["name"]; acc}
  end
end
