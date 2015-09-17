class DemoBookmarkController < ApplicationController
  before_filter :general_authentication
  before_filter :get_employee
  before_filter :get_entity_manager
  after_filter :close_entity_manager

  def index
    @bookmarks = get_bookmarks
  end

  def create
    @bookmark = DemoBookmark.create(params)
    if @bookmark.save
      flash[:notice] = "Review saved."
    else
      flash[:error] = "There was an issue saving your review: #{@bookmark.errors.full_messages.join(" ")}"
    end

    render nothing: true
  end

  private
  def get_bookmarks
    DemoBookmark.where(:identifier, @employee.username)
  end
end
