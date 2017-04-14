class ExamUpdateController < ApplicationController
  before_filter :authenticate

  def location
    sleep(5)
    #render :text => "{}"
    render :status => 500
  end
end
