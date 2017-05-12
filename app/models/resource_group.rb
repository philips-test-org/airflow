class ResourceGroup < ActiveRecord::Base
  self.table_name = "airflow_resource_groups"
  has_many :resource_group_mappings, foreign_key: "resource_group_id", dependent: :destroy
end
