class AvatarsController < ApplicationController
  before_filter :general_authentication
  before_filter :get_entity_manager
  after_filter :close_entity_manager

  def show
    id = params["id"].to_i
    employee = Java::HarbingerSdkData::Employee.withId(id, @entity_manager)

    if employee && ! employee.demographicHash["photo"].blank?
      matches = employee.demographicHash["photo"].match(/\Adata:(.*);base64,(.*)\z/m)
      send_data Base64.decode64(matches[2]), type: matches[1], disposition: 'inline'
    else
      if Rails.env.production?
        basename = File.basename(ActionController::Base.helpers.asset_path("placeholder.png"))
        placeholder = Rails.root.join("public", "assets", basename)
      else
        placeholder = Rails.root.join("app", "assets", "images", "placeholder.png")
      end
      send_file placeholder, type: "image/png", disposition: "inline"
    end
  end
end
