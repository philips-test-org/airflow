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
        q.where([q.notEqual(".id",order.getId),
                 q.equal(".patientMrnId",order.patient_mrn_id),
                 q.equal(".resourceId",order.resource_id),
                 q.equal(".appointment",order.appointment)])
        all = q.list.to_a.inject([]) {|list,o| list + [o,o.master_order] }.compact.uniq
      end
    else
      exam = Java::HarbingerSdkData::RadExam.withId(params[:id].to_i,@entity_manager)
      q = Java::HarbingerSdkData::RadExam.createQuery(@entity_manager)
      filters = [q.notEqual(".id",exam.getId),
                 q.equal(".patientMrnId",exam.patient_mrn_id),
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

  private

  def all_resource_group_ids
    ResourceGroup.resource_group_hash(@entity_manager).map {|k,v| v.map {|x| x["id"]}}.flatten.uniq
  end
end
