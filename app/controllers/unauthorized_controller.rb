class UnauthorizedController < ApplicationController
  after_filter :log_usage_data

  def index
  end

end
