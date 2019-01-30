class ResourceGroupsController < ApplicationController
  before_filter :get_entity_manager
  before_filter :mananger_authentication
  before_filter :get_employee
  after_filter :log_usage_data
  after_filter :close_entity_manager


  def index
    @resource_groups = ResourceGroup.all
  end

  def search
    rgms = ResourceGroupMapping.where({resource_group_id: params[:resource_group_id]}).select(:resource_id).all.collect(&:resource_id)
    q = Java::HarbingerSdkData::Resource.createQuery(@entity_manager)
    filters = []
    filters << q.equal(".modalityId",params[:modality_id]) unless params[:modality_id].blank?
    filters << q.or([q.ilike(".resource",matcher(params[:search])),
                     q.ilike(".name",matcher(params[:search]))]) unless params[:search].blank?
    filters << q.not([q.in(".id",rgms)]) if rgms.size > 0
    q.where(filters)

    search_list = q.list.to_a.collect {|r| OrmConverter.resource(r) }
    if rgms.size > 0
      q2 = Java::HarbingerSdkData::Resource.createQuery(@entity_manager)
      selected_list = q2.where(q.in(".id",rgms)).list.to_a.collect {|r| hash = OrmConverter.resource(r); hash[:state] = "selected"; hash }
    else
      selected_list = []
    end

    render :json => (selected_list + search_list).to_json
  end

  def create
    rg = ResourceGroup.create({group_name: params[:name]})
    render :json => rg
  end

  def delete
    rg = ResourceGroup.find(params[:id])
    rg.destroy if rg
    render :text => "ok"
  end

  def associate
    rgm = ResourceGroupMapping.create({resource_group_id: params[:resource_group_id],
                                       resource_id: params[:resource_id]})
    render json: rgm
  end

  def disassociate
    rgm = ResourceGroupMapping.where({resource_group_id: params[:resource_group_id],
                                      resource_id: params[:resource_id]}).all
    rgm.collect(&:destroy)
    render :text => "ok"
  end

  private
  def matcher(string)
    if string =~ /\*\%/
      string.gsub("*","%")
    else
      "%#{string}%"
    end
  end

end
