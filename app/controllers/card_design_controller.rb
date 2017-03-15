class CardDesignController < ApplicationController
  before_filter :authenticate

  def index
    @exam = Java::HarbingerSdkData::RadExam.withId(8692099,@entity_manager)
  end

end
