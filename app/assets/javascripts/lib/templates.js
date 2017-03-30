if (typeof application == "undefined") { application = {} }

application.templates = {};
application.partials = {};
application.templates.pixels_per_second = 200.0 / 60.0 / 60.0;

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
    var color = "#ddd";
    if (exam.onhold == true) {
	color = "#f5f52b"
    } else if (exam.rad_exam_detail.delay_reason_id) {
	color = "#ff8800";
    } else if (!(exam.rad_exam_time.begin_exam && exam.rad_exam_time.appointment)) {
	color = "#57dee8";
    } else if (exam.site_class && exam.site_class.trauma) {
	color = "#ff51eb";
    } else if (exam.site_class && exam.site_class.ed) {
	color = "#9315c1";
    } else if (exam.site_class && exam.site_class.patient_type && exam.site_class.patient_type.patient_type == "O") {
	color = "#53a790";
    } else if (exam.site_class && exam.site_class.patient_type.patient_type == "I") {
	color = "#398cc4";
    }
    return color;
});

Handlebars.registerHelper('exams_from_resource',function(resource) {
    return application.data.masterExams.filter(function(exam) { return exam.resource_id == resource.id; });
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

Handlebars.registerHelper('check_test',function(val) {
    if (val == true) {
	return "checked";
    }
});

Handlebars.registerHelper('block_test',function(val, block) {
    if (val == true) {
	return block.fn(val);
    }
});

/* General Helpers */
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
