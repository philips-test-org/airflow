class DemoController < ApplicationController
  before_filter :general_authentication
  before_filter :get_entity_manager
  before_filter :get_employee
  after_filter :close_entity_manager

  def real_time
  end

  def show_bookmarks
    @bookmarks = get_bookmarks
    log_hipaa_view(@bookmarks.map{|b| b.rad_exam})
  end

  def create_bookmark
    @bookmark = DemoBookmark.new({:identifier => params[:identifier], :rad_exam_id => params[:rad_exam_id]})

    if @bookmark.save
      flash[:notice] = "Review saved."
    else
      flash[:error] = "There was an issue saving your review: #{@bookmark.errors.full_messages.join(" ")}"
    end

    redirect_to action: :show_bookmarks
  end

  def accession_search
    @exams = []

    if params[:accession]
      @exams = search_by_accession(params[:accession])
      log_hipaa_view(@exams)
      @acc_search = params[:accession]
    end
  end

  def exams_by_site
    @sites = get_all_sites

    @site_id = params[:site_id]
    if @site_id
      @exams = search_by_site(@site_id)
      log_hipaa_view(@exams)
    end
  end

  private
  def get_bookmarks
    DemoBookmark.where(:identifier => @employee.username)
  end

  def search_by_accession(accession)
    query = Java::HarbingerSdkData::RadExam.createQuery(@em)
    query.where(query.ilike(".accession", "%#{accession}%")).list.to_a
  end

  def search_by_site(site_id)
    query = Java::HarbingerSdkData::RadExam.createQuery(@em)
    query.where(query.equal(".site.id", site_id.to_i)).limit(10).list.to_a
  end

  def get_all_sites
    query = Java::HarbingerSdkData::Site.createQuery(@em)
    query.list.to_a
  end

end
