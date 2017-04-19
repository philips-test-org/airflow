class ExamUpdateController < ApplicationController
  before_filter :authenticate

  def location
    ea = ExamAdjustment.update_location(params)
    render :json => ea.adjusted_attributes
  end
end
