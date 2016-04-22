class MainController < ApplicationController
  before_filter :get_entity_manager
  before_filter :general_authentication
  after_filter :close_entity_manager

  def index
  end

  def about
  end

  def help
  end

end
