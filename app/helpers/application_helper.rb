module ApplicationHelper

  def global_navigation_link(title, url_opts, matching_url_ops = {})
    matching_url_ops = url_opts if matching_url_ops == {}
    matches = matching_url_ops.keys.collect {|key| matching_url_ops[key].to_s == params[key].to_s ? true : false }
    matches.include?(false) ? active = "" : active = "active"
    content_tag(:li, link_to(title, url_opts, :name => title.downcase.gsub(" ","-").gsub("/","")), :class => active)
  end

  def global_view_link(title, view_type, url_opts, matching_url_ops = {})
    matching_url_ops = url_opts if matching_url_ops == {}
    matches = matching_url_ops.keys.collect {|key| matching_url_ops[key].to_s == params[key].to_s ? true : false }
    matches.include?(false) ? active = "" : active = "active"
    content_tag(:li, link_to(title, url_opts, {
                               :name => title.downcase.gsub(" ","-").gsub("/",""),
                               :class => "view-changer", "data-view-type" => view_type
                             }),
                :class => active,
                id: "#{title.downcase.gsub(" ","-")}-link"
               )
  end

end
