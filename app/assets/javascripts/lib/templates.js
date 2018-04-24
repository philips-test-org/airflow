if (typeof application == "undefined") { application = {} }

application.templates = {};

$(document).ready(function() {
  $.each($(".handlebars-template"),function(i,e) {
    //remove t prefix and camel case
    var name_array = $(e).attr("id").split("-");
    var name = name_array[1] + name_array.slice(2,name_array.length).map(function(ss) { return ss.charAt(0).toUpperCase() + ss.slice(1,ss.length); }).join("");
    application.templates[name] = Handlebars.compile($(e).html());
    Handlebars.registerPartial(name, application.templates[name]);
  });
});

Handlebars.registerHelper('notification_type',function(type) {
  if (type == "comment") {
    return "comment-notification " + type;
  } else {
    return "notification " + type;
  }
});

Handlebars.registerHelper('event_type_check',function(type) {
  if (type == "comment" || type == "event") return true;
  else return false;
});

/* General Helpers */
Handlebars.registerHelper('or',function(a,b) {
  if (a == "" || a == undefined || a == null) return b;
  else return a;
});
