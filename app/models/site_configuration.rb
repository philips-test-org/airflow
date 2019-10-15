class SiteConfiguration < ActiveRecord::Base
  self.table_name = "airflow_site_config"
  ROLES_LISTS = ["clinical_roles_auth_list", "manager_roles_auth_list"]
  OTHER_CONFIG_VARS = []
  APP_MANUALS = []
  DEFAULTS = {
    :clinical_roles_auth_list => ["director", "technologist", "radiologist", "ai-staff", "it-staff", "supervisor", "executive"],
    # managers can see the admin dropdown in header menu but cannot access site configuration
    :manager_roles_auth_list => ["ai-staff", "it-staff"],
    :admin_manual => "https://docs.analytical.info/app-manuals/#{APPLICATION_MACHINE_NAME}/admin-manual.pdf",
    :user_manual => "https://docs.analytical.info/app-manuals/#{APPLICATION_MACHINE_NAME}/user-manual.pdf"
  }

  def self.all_available_keys
    ROLES_LISTS + OTHER_CONFIG_VARS + APP_MANUALS
  end

  def self.app_manual_keys
    APP_MANUALS
  end

  def self.admin_user_manual(type)
    "https://docs.analytical.info/app-manuals/patient-flow/" + type + "-manual-" + I18n.locale.to_s + ".pdf"
  end

  def self.defaults
    DEFAULTS
  end

  def self.role_list_keys
    ROLES_LISTS
  end

  def self.get_username
    config = self.get_configuration
    return config.username
  end

  def self.get_configuration_time
    config = self.get_configuration
    return config.configuration_time
  end

  def self.get_clinical_roles_for_key(key)
    self.get_configuration.get_clinical_roles_for_key(key)
  end

  def get_clinical_roles_for_key(key)
    auth_list = JSON.parse(configuration_json)[key]
    self.class.assure_permissions(auth_list, key)
  end

  def self.get_value(key)
    self.get_configuration.get_value(key)
  end

  def get_value(key)
    value = JSON.parse(configuration_json)[key]

    if value.blank? && APP_MANUALS.include?(key)
      value = DEFAULTS[key.to_sym]
    end
    if key == "admin_manual" || key == "user_manual"
      config_value = JSON.parse(configuration_json)[key]
      value = config_value.gsub(".pdf", "-#{I18n.locale.to_s}.pdf")
    end
    value    
  end

  #assure minimal permissions are in place
  def self.assure_permissions(auth_list, key)
    auth_list ||= []
    auth_list << "it-staff"
    auth_list << "ai-staff"
    auth_list.uniq
  end

  def self.update_configuration(username, options)
    new_config = JSON.parse(self.get_configuration.configuration_json)

    #only allow data from specified keys
    self.all_available_keys.each do |config_var|
      if options.has_key?(config_var)
        new_config[config_var] = options[config_var]

        if options[config_var].blank? && APP_MANUALS.include?(config_var)
          new_config[config_var] = DEFAULTS[config_var.to_sym]
        end
      end
    end

    #assure minimal permissions in role lists
    ROLES_LISTS.each do |list_key|
      new_config[list_key] = self.assure_permissions(new_config[list_key], list_key)
    end

    site_config = self.new
    site_config.username = username
    site_config.configuration_time = Time.now
    site_config.configuration_json = new_config.to_json
    site_config.save
  end

  def self.get_configuration
    self.last || self.load_default_configuration
  end

  private

  def self.load_default_configuration
      config = self.new
      config.username = "default-setup"
      config.configuration_time = Time.now
      config.configuration_json = JSON.generate(DEFAULTS)
      config.save
      return config
  end
end
