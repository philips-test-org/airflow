module HarbingerSdkFilters
  extend ActiveSupport::Concern

  included do
    before_filter :get_entity_manager
    before_filter :general_authentication
    after_filter :log_usage_data
    after_filter :close_entity_manager
  end
end
