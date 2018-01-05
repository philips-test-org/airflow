if (typeof application == "undefined") { application = {} }

application.templates = {};
application.partials = {};
application.templates.pixels_per_second = 200.0 / 60.0 / 60.0;
application.statuses = {
    value_check: function(order,type,default_val) {
	var value = default_val;
	for (var i in application.statuses.checks) {
	    if (application.statuses.checks[i].check(order)) {
		if (application.statuses.checks[i][type] != undefined) value = application.statuses.checks[i][type];
		break;
	    }
	}
	return value;

    },
    color: function(order) {
	return application.statuses.value_check(order,"color","#ddd");
    },
    card_class: function(order) {
	return application.statuses.value_check(order,"card_class","");
    },
    checks: [{name: "On Hold",
	      order: 5,
	      color: "#f5f52b",
	      card_class: "highlight",
	      check: function(order) { return (order.adjusted.onhold == true); }},
	     {name: "Cancelled",
	      order: 6,
	      color: "#c8040e",
	      check: function(order) { return (order.current_status.universal_event_type == "cancelled" || (order.rad_exam != undefined && order.rad_exam.current_status.universal_event_type.event_type == "cancelled")); }},
	     {name: "Started",
	      order: 3,
	      color: "#704c8f",
	      check: function(order) { return (order.rad_exam != undefined && order.rad_exam.rad_exam_time.begin_exam && order.rad_exam.rad_exam_time.end_exam == null); }},
	     {name: "Completed",
	      order: 4,
	      color: "#398cc4",
	      card_class: "completed",
	      check: function(order) { return (order.rad_exam != undefined && order.rad_exam.rad_exam_time.end_exam != null); }},
	     {name: "Patient Arrived",
	      order: 2,
	      color: "#53a790",
	      check: function(order) { return (order.rad_exam != undefined && (order.rad_exam.rad_exam_time.sign_in || order.rad_exam.rad_exam_time.check_in) != null); }},
	     {name: "Ordered",
	      order: 1,
	      color: "#a0a0a0",
	      check: function(order) { return (order.rad_exam == undefined || !(order.rad_exam.rad_exam_time.sign_in || order.rad_exam.rad_exam_time.check_in)); }}
	    ]
};

// Sort checks by the order; be sure to dup the array as the original order needs to be preserved
application.statuses.ordered_checks = application.statuses.checks.slice(0,application.statuses.checks.length).sort(function(a,b) {
    if (a.order > b.order) {
	return 1;
    } else if (a.order < b.order) {
	return -1;
    } else {
	return 0;
    }
});



$(document).ready(function() {
    $.each($(".handlebars-template"),function(i,e) {
	//remove t prefix and camel case
	var name_array = $(e).attr("id").split("-");
	var name = name_array[1] + name_array.slice(2,name_array.length).map(function(ss) { return ss.charAt(0).toUpperCase() + ss.slice(1,ss.length); }).join("");
	application.templates[name] = Handlebars.compile($(e).html());
	Handlebars.registerPartial(name, application.templates[name]);
    });
});

Handlebars.registerHelper('format_name',function(patient_name) {
    return patient_name.split("^").filter(function(part) { return part != ""; }).join(", ");
});

Handlebars.registerHelper('format_hour',function(hour) {
    if (String(hour).length > 1) {
	return String(hour) + ":00";
    } else {
	return "0" + hour + ":00";
    }
});

Handlebars.registerHelper('format_date',function(date) {
    return date;
});

Handlebars.registerHelper('format_timestamp',function(epoch) {
    if (epoch) {
	return moment(epoch).format('MMMM Do YYYY, HH:mm');
    }
});

Handlebars.registerHelper('avatar',function(employee_id, placeholder) {
    var url = $.harbingerjs.core.url('/avatar?id=' + employee_id);
    return new Handlebars.SafeString('<img class="avatar" src="' + url + '" onerror="this.onerror=null; this.src=\'' + placeholder + '\';"/>');
});

Handlebars.registerHelper('order_color',function(order) {
    return application.statuses.color(order);
});

Handlebars.registerHelper('order_card_class',function(order) {
    return application.statuses.card_class(order);
});

Handlebars.registerHelper('orders_from_resource',function(resource) {
    return application.data.masterOrders
	.map(function(id) { return application.data.orderHash[id]; })
	.filter(function(order) { if (application.data.resource(order) == undefined) { return false; }
				  else { return application.data.resource(order).id == resource.id; } })
	.sort(function(a,b) {
	    if (application.data.orderStartTime(a) < application.data.orderStartTime(b)) {
		return -1;
	    } else if (application.data.orderStartTime(a) > application.data.orderStartTime(b)) {
		return 1;
	    } else { return 0; }
	    //return application.data.examStartTime(a) - application.data.examStartTime(b); });
	});
});

Handlebars.registerHelper('order_with_fellows',function(order) {
    return application.data.findOrderWithFellows(order.id);
});

Handlebars.registerHelper('negative_duration',function(order) {
    return (application.data.orderDuration(order) < 0);
});

Handlebars.registerHelper('order_height',function(order) {
    var seconds = (application.data.orderDuration(order) / 1000);
    // Default for bad data
    if (seconds < 0) {
	return "30px;"
    } else {
	return Math.round(seconds * application.templates.pixels_per_second) + "px";
    }
});

Handlebars.registerHelper('order_duration',function(order) {
    return application.data.orderDuration(order);
});

Handlebars.registerHelper('current_duration',function(order) {
    return Handlebars.helpers.format_duration(application.data.orderDuration(order) / 1000);
});

Handlebars.registerHelper('format_duration',function(duration) {
    if ((duration || duration === 0) && ! isNaN(parseInt(duration))) {
	var duration = parseInt(duration);
	if (duration >= 0) { var extra = false; } else { var extra = true; }
	if (extra) { duration = duration * -1 }
	var seconds = duration % 60;
	var minutes = (parseInt(duration/60)) % 60;
	var hours = (parseInt(duration/3600)) % 24;
	var days = parseInt(duration/3600/24);
	if (extra) { var sign = "-"; } else { var sign = ""; }
	if (days > 0) {
	    var out = sign + days + ' d, ' + hours + ' h';// + minutes + ' min';//, #{seconds} s"
	} else {
	    var out = sign + hours + ' h, ' + minutes + ' m';//, #{seconds} s"
	}
	if (extra) {
	    return new Handlebars.SafeString('<span class="alert-red">' + out + '</span>');
	}
    } else if (duration) {
	return duration;
    } else {
	return "---";
    }
});

Handlebars.registerHelper('default_procedure_duration',function(order) {
    var duration = 60 * Handlebars.helpers.exam_then_order(order,"procedure.scheduled_duration");
    return Handlebars.helpers.format_duration(duration);
});

Handlebars.registerHelper('short_order',function(order) {
    var seconds = ((application.data.orderStopTime(order) - application.data.orderStartTime(order)) / 1000);
    return (Math.round(seconds * application.templates.pixels_per_second) <= 50);
});


Handlebars.registerHelper('order_top',function(order) {
    var t = moment(application.data.orderStartTime(order));
    return Math.round((t.hour() * 60 * 60 + t.minute() * 60 + t.seconds()) * application.templates.pixels_per_second) + "px";
});

Handlebars.registerHelper('kiosk_number',function(id) {
    return String(id).slice(-4)
});

Handlebars.registerHelper('kiosk_number_html',function(order) {
    var style = "";
    var height = Number(Handlebars.helpers.order_height(order).replace("px",""));
    if (height < 36) {
	var style = "font-size: " + height / 2 + "px;";
    }
    var out = '<div class="kiosk-number" style="' + style + ' line-height: ' + height + 'px;">' + Handlebars.helpers.kiosk_number(order.id) + '</div>';
    return new Handlebars.SafeString(out);
});

Handlebars.registerHelper('patient_location',function(order) {
    var exam = order.rad_exam;
    if (exam != undefined && exam.site_sublocation != undefined && Object.keys(exam.site_sublocation).length > 0) {
	if (exam.site_sublocation.site_location.name != undefined && exam.site_sublocation.site_location.name != "") {
	    var name = exam.site_sublocation.site_location.name;
	} else {
	    var name = exam.site_sublocation.site_location.location;
	}
	return name + ", Room: " + exam.site_sublocation.room + ", Bed: " + exam.site_sublocation.bed;
    }
});

Handlebars.registerHelper('resource_name',function(order) {
    if ($.type(order) == "number") {
	var resource = application.data.findResource(order);
    } else {
	var resource = application.data.resource(order);
    }
    if (resource.name != undefined && resource.name != "") {
	return resource.name;
    } else {
	return resource.resource;
    }
});

Handlebars.registerHelper('site_class_name',function(site_class) {
    if (site_class == undefined) {
	return "";
    } else if (site_class.name != "" && site_class.name != undefined) {
	return site_class.name;
    } else {
	return site_class.site_class;
    }
});

Handlebars.registerHelper('appointment_time',function(order) {
    if (order.rad_exam != undefined) {
	return order.rad_exam.rad_exam_time.appointment;
    } else {
	return order.appointment
    }
});

Handlebars.registerHelper('exam_then_order',function(order,path) {
    return application.data.examThenOrder(order,path);
});

Handlebars.registerHelper('event_type_check',function(type) {
    if (type == "comment" || type == "event") return true;
    else return false;
});

Handlebars.registerHelper('chronological_events',function(order) {
    return application.data.allEvents(order.id);
});

Handlebars.registerHelper('notification_type',function(type) {
    if (type == "comment") {
	return "comment-notification " + type;
    } else {
	return "notification " + type;
    }
});

Handlebars.registerHelper('render_event',function(event) {
    //var template = "event" + event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1);
    if (event.event_type == 'comment') {
	return new Handlebars.SafeString(application.templates.eventComment(event));
    } else if (event.event_type == 'location_update') {
	return new Handlebars.SafeString(application.templates.eventLocationChange(event));
    } else {
	return new Handlebars.SafeString(application.templates.eventStateChange(event));
    }
});

Handlebars.registerHelper('toggle_icon',function(name) {
  var icon = "";
  switch(name) {
    case "onhold":
      icon = "fa fa-hand-paper-o";
      break;
    case "anesthesia":
      icon = "fa fa-bed";
      break;
    case "consent":
      icon = "fa fa-handshake-o";
      break;
    case "ppca_ready":
      icon = "fa fa-thumbs-o-up";
      break;
    case "paperwork":
      icon = "fa fa-file-text";
  }
  return icon;
});

Handlebars.registerHelper('toggle_label',function(name) {
  var language = "";
  switch (name) {
    case "onhold":
      break;
    case "ppca_ready":
      language = "PPCA Ready"
      break;
    default:
      language = name.charAt(0).toUpperCase() + name.slice(1);
  }

  return new Handlebars.SafeString('<strong><i class="' + Handlebars.helpers.toggle_icon(name) + '"></i> ' + language + '</strong>');
});

Handlebars.registerHelper('toggle_state',function(name,new_state) {
    var bool = new_state[name];
    if (bool && name == "onhold") {
	var language = "On Hold";
	var klass = "label-primary";
    } else if (name == "onhold") {
	var language = "Active";
	var klass = "label-default";
    } else if (bool) {
	var language = "Complete";
	var klass = "label-primary";
    } else {
	var language = "Incomplete";
	var klass = "label-default";
    }
    return new Handlebars.SafeString('<span class="label ' + klass + '">' + language + '</span>');
});

Handlebars.registerHelper('has_comments',function(order,block) {
    if (application.data.allEvents(order.id).filter(function(event) { return event.event_type == 'comment'; }).length > 0) {
	return block.fn(order);
    }
});

Handlebars.registerHelper('check_test',function(val) {
    if (val == true) {
	return "checked";
    }
});


/* General Helpers */
Handlebars.registerHelper('or',function(a,b) {
    if (a == "" || a == undefined || a == null) return b;
    else return a;
});

Handlebars.registerHelper('eq',function(a,b) {
    return a == b;
});

Handlebars.registerHelper('log',function(a) {
    console.log(a);
});

Handlebars.registerHelper('multiply',function(a,b) {
    return a * b;
});

Handlebars.registerHelper('call',function(arguments) {
    return arguments[0].apply(arguments.slice(1,arguments.length));
});

Handlebars.registerHelper('times', function(n, block) {
    var toReturn = '';
    for(var i = 0; i < n; ++i) {
        toReturn += block.fn(i);
    }
    return toReturn;
});
