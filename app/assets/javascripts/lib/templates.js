if (typeof application == "undefined") { application = {} }

application.templates = {};
application.partials = {};
application.templates.pixels_per_second = 200.0 / 60.0 / 60.0;
application.statuses = {
    color: function(exam) {
	var color = "#ddd";
	for (var i in application.statuses.checks) {
	    if (application.statuses.checks[i].check(exam)) {
		color = application.statuses.checks[i].color;
		break;
	    }
	}
	return color;
    },
    checks: [{name: "On Hold",
	      color: "#f5f52b",
	      check: function(exam) { return (exam.adjusted.onhold == true); }},
	     {name: "Cancelled",
	      color: "#c8040e",
	      check: function(exam) { return (exam.current_status.universal_event_type && exam.current_status.universal_event_type.event_type == "cancelled"); }},
	     {name: "Completed",
	      color: "#398cc4",
	      check: function(exam) { return (exam.rad_exam_time.end_exam != null); }},
	     {name: "Future Appointment",
	      color: "#a0a0a0",
	      check: function(exam) { return (!(exam.rad_exam_time.sign_in || exam.rad_exam_time.check_in)); }},
	     {name: "Patient Arrived",
	      color: "#53a790",
	      check: function(exam) { return ((exam.rad_exam_time.sign_in || exam.rad_exam_time.check_in) != null); }}
	    ]
};

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

Handlebars.registerHelper('exam_color',function(exam) {
    return application.statuses.color(exam);
});

Handlebars.registerHelper('exams_from_resource',function(resource) {
    return application.data.masterExams
	.map(function(id) { return application.data.examHash[id]; })
	.filter(function(exam) { return application.data.resource(exam).id == resource.id; })
	.sort(function(a,b) {
	    if (application.data.examStartTime(a) < application.data.examStartTime(b)) {
		return -1;
	    } else if (application.data.examStartTime(a) > application.data.examStartTime(b)) {
		return 1;
	    } else { return 0; }
	    //return application.data.examStartTime(a) - application.data.examStartTime(b); });
	});
});

Handlebars.registerHelper('exam_height',function(exam) {
    var seconds = ((application.data.examStopTime(exam) - application.data.examStartTime(exam)) / 1000);
    return Math.round(seconds * application.templates.pixels_per_second) + "px";
});

Handlebars.registerHelper('short_exam',function(exam) {
    var seconds = ((application.data.examStopTime(exam) - application.data.examStartTime(exam)) / 1000);
    return (Math.round(seconds * application.templates.pixels_per_second) <= 50);
});


Handlebars.registerHelper('exam_top',function(exam) {
    var t = moment(application.data.examStartTime(exam));
    return Math.round((t.hour() * 60 * 60 + t.minute() * 60 + t.seconds()) * application.templates.pixels_per_second) + "px";
});

Handlebars.registerHelper('kiosk_number',function(id) {
    return String(id).slice(-3)
});

Handlebars.registerHelper('kiosk_number_html',function(exam) {
    var style = "";
    var height = Number(Handlebars.helpers.exam_height(exam).replace("px",""));
    if (height < 36) {
	var style = "font-size: " + height / 2 + "px;";
    }
    var out = '<div class="kiosk-number" style="' + style + ' line-height: ' + height + 'px;">' + Handlebars.helpers.kiosk_number(exam.id) + '</div>';
    return new Handlebars.SafeString(out);
});

Handlebars.registerHelper('patient_location',function(exam) {
    if (exam.site_sublocation != undefined && Object.keys(exam.site_sublocation).length > 0) {
	if (exam.site_sublocation.site_location.name != undefined && exam.site_sublocation.site_location.name != "") {
	    var name = exam.site_sublocation.site_location.name;
	} else {
	    var name = exam.site_sublocation.site_location.location;
	}
	return name + ", Room: " + exam.site_sublocation.room + ", Bed: " + exam.site_sublocation.bed;
    }
});

Handlebars.registerHelper('resource_name',function(exam) {
    if ($.type(exam) == "number") {
	exam = {resource: application.data.findResource(exam)};
    }
    if (exam.resource.name != undefined && exam.resource.name != "") {
	return exam.resource.name;
    } else {
	return exam.resource.resource;
    }
});

Handlebars.registerHelper('event_type_check',function(type) {
    if (type == "comment" || type == "event") return true;
    else return false;
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
    case "constent":
	icon = "fa fa-handshake-o";
	break;
    case "onhold":
	icon = "fa fa-hand-paper-o";
	break;
    case "anesthesia":
	icon = "fa fa-bed";
	break;
    case "consent":
	icon = "fa fa-handshake-o";
	break;
    case "paperwork":
	icon = "fa fa-file-text";
    }
    return icon;
});

Handlebars.registerHelper('toggle_label',function(name) {
    if (name == "onhold") {
	var language = "";
    } else {
	var language = name.charAt(0).toUpperCase() + name.slice(1);
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

Handlebars.registerHelper('has_comments',function(events,block) {
    if (events.filter(function(event) { return event.event_type == 'comment'; }).length > 0) {
	return block.fn(events);
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
