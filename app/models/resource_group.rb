class ResourceGroup < ActiveRecord::Base
  self.table_name = "airflow_resource_groups"
  has_many :resource_group_mappings, foreign_key: "resource_group_id", dependent: :destroy


  def self.resource_group_hash(em)
    rgs = self.all.to_a
    rgs.delete_if {|rg| rg.resource_group_mappings.size == 0 }
    rgs.sort(&:group_name).inject({}) {|hash,rg| hash[rg.group_name] = OrmConverter.resources(rg.resources(em)); hash }
  end

  def resources(em)
    q = Java::HarbingerSdkData::Resource.createQuery(em)
    q.where(q.in(".id",self.resource_group_mappings.collect(&:resource_id)))
    q.order([".name asc",".resource asc"])
    q.list.to_a
  end
end
