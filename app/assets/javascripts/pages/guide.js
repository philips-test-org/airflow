if (typeof application == "undefined") { application = {} }

application.data = {
    exams: [],
    hours: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
    masterExams: [],
    resources: [],
    buildCalendar: function(exams) {
	application.data.exams = exams;
	application.data.resources = $.parseJSON($("#resource-groupings-json").text());
	var masterExamIds = [];
	for (var i in application.data.exams) {
	    var exam = exams[i];
	    var exam_group_ident = exam.patient_mrn_id + exam.resource_id + application.data.examStartTime(exam);
	    if (masterExamIds.indexOf(exam_group_ident) == -1) {
		application.data.masterExams.push(exam);
		masterExamIds.push(exam_group_ident);
	    }
	}
	application.calendar.setup();
    },
    examStartTime: function(exam) {
	if (exam.rad_exam_time.begin_exam) {
	    return exam.rad_exam_time.begin_exam;
	} else {
	    return exam.rad_exam_time.appointment;
	}
    },
    examStopTime: function(exam) {
	if (exam.rad_exam_time.end_exam) {
	    return exam.rad_exam_time.end_exam;
	} else {
	    return appointment.data.examStartTime(exam) + (exam.procedure.scheduled_duration * 60 * 1000);
	}
    }
}

application.calendar = {
    setup: function() {
	$("#workspace").html(application.templates.calendar(application.data));
	$("#board").scroll(function(e) {
	    var scroll = this.scrollLeft;
	    $("#time-headings").offset({left: -1*scroll+50});
	    $("#vertical-time-headings").css({left: scroll});
	});

	var now = new Date;
	var pixes_per_second = 200 / 60 / 60;
	var distance = Math.round(pixes_per_second * (now.getHours() * 60 * 60 + now.getMinutes() * 60 + now.getSeconds()));

	$("#right-now").css({top: 91 + distance}).show();
	$("#right-now").css({width: $("#time-grid").width()});
	$("#board").scrollTo({top: ($("#right-now").position().top - ($("#board").height()/2)), left: 0},500);

	$(".notecard").hover(
	    function(e) { console.log('hover in',this); $(this).css({'z-index': 200}); },
	    function(e) { console.log('hover out',this); $(this).css({'z-index': 101}); });

    }
}

$(document).ready(function() {
    $.ajax($.harbingerjs.core.url("exams"),
	   {success: function(exams) {
	       application.data.buildCalendar(exams);
	   }});
});
