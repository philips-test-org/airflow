if (typeof application == "undefined") { application = {} }

application.calendar = {
    setup: function() {
	//build calendar
	$("#workspace").html(application.templates.calendar(application.data));

	//Make time and room headings scroll with calendar
	$("#board").scroll(function(e) {
	    var scroll = this.scrollLeft;
	    $("#time-headings").offset({left: -1*scroll+50});
	    $("#vertical-time-headings").css({left: scroll});
	});

	var now = new Date;
	var pixes_per_second = 200 / 60 / 60;
	var distance = Math.round(pixes_per_second * (now.getHours() * 60 * 60 + now.getMinutes() * 60 + now.getSeconds()));

	// Set up the "Right Now" line
	$("#right-now").css({top: 91 + distance}).show();
	$("#right-now").css({width: $("#time-grid").width()});
	$("#board").scrollTo({top: ($("#right-now").position().top - ($("#board").height()/2)), left: 0},500);

	$("#board").on("hover",".notecard",
	    function(e) { $(this).css({'z-index': 200}); },
	    function(e) { $(this).css({'z-index': 101}); });

	$(".notecard").draggable({revert: 'invalid',
				  cursor: 'move',
				  delay: 200});

	$("#time-grid tr td").droppable({
	    accepts: ".notecard",
	    drop: function(e) {
		var column = $(this);
		if ($(e.toElement).hasClass("notecard")) {
		    var notecard = $(e.toElement);
		} else {
		    var notecard = $(e.toElement).parents(".notecard");
		}
		var id = notecard.find(".data").data("exam-id");
		var resource_id = column.data("resource-id");
		var resource = application.data.findResource(resource_id);
		application.data.update(id,function(exam) {
		    var ostart = application.data.examStartTime(exam);
		    var ostop = application.data.examStopTime(exam);
		    var nstart = application.data.examHeightToStartTime(notecard.position().top,exam);
		    var nstop =  application.data.examHeightToStopTime(notecard.position().top,exam);
		    exam.adjusted_start_time = nstart;
		    exam.adjusted_stop_time = nstop;
		    exam.adjusted_resource = $.extend({},resource);
		    notecard.appendTo(column);
		    return exam;
		});
	    }});


	application.data.hook("exam-update","card-redraw",function(exam) {
	    application.calendar.redrawCard(exam);
	});

    },
    breakdown: function() {
	application.data.unhook("exam-update","card-redraw");
    },
    findCard: function(exam) {
	return $("#scaled-card-" + exam.id);
    },
    redrawCard: function(exam) {
	var r = application.calendar.findCard(exam).replaceWith(application.templates.scaledCard(exam));
	application.calendar.findCard(exam).draggable({revert: 'invalid',
						       cursor: 'move',
						       delay: 200});
	return r;
    }
}

application.overview = {
    setup: function() {
	$("#workspace").html(application.templates.overview(application.data));

	application.data.hook("exam-update","card-redraw",function(exam) {
	    application.overview.redrawCard(exam);
	});

	$("#relative-board .resource-row").width($("#relative-board")[0].scrollWidth);

	$("#workspace #relative-board").scroll(function(e) {
	    var scroll = this.scrollLeft;
	    $(this).find(".resource-row>h1").css({left: scroll - 48});
	});

    },
    breakdown: function() {
	application.data.unhook("exam-update","card-redraw");
    },
    findCard: function(exam) {
	return $("#fixed-card-" + exam.id);
    },
    redrawCard: function(exam) {
	return application.overview.findCard(exam).replaceWith(application.templates.fixedCard(exam));
    }
}

$(document).ready(function() {
    if ($(".active .view-changer").length > 0) {
	var view = $(".active .view-changer").data("view-type");
	application.view = application[view];
    } else {
	application.view = application.calendar;
    }


    $.ajax($.harbingerjs.core.url("exams"),
	   {success: function(exams) {
	       application.data.formatExams(exams);
	       application.view.setup();
	   }});

    $("#workspace").on("click",".notecard",function(e) {
	var exam = application.data.findExam($(this).find(".data").data("exam-id"));
	application.modal.open(exam);
    });


    $("#exam-modal").on("submit","#comment-form",function(e) {
	e.preventDefault();
	var self = $(this);
	var button = self.find("button.add-comment");
	var textarea = self.find("textarea");
	var exam_id = self.find("input[name='exam_id']").val();
	$.ajax($.harbingerjs.core.url("/comments/create"),
	       {data: $(this).serializeArray(),
		method: 'POST',
		beforeSend: function() {
		    button.prop("disabled",true);
		    textarea.prop("disabled",true);
		},
		error: function() {
		    if (console) { console.log("Error saving comment",arguments); }
		},
		success: function(exam_comment) {
		    self.siblings(".comments").append(application.templates.comment(exam_comment));
		    application.data.addComment(exam_id,exam_comment);
		    textarea.val("");
		}}).always(function() {
		    button.prop("disabled",false);
		    textarea.prop("disabled",false);
		});

    });

    $("#exam-modal").on("change",".status-toggle input",function(e) {
	var exam_id = $(this).parents(".modal-content").find(".data").text();
	application.data.update_attribute(exam_id,$(this).attr('name'),this.checked,["modal-update","exam-update"]);
    });

    $(".view-changer").click(function(e) {
	e.preventDefault();
	var view = $(this).data("view-type");
	application.view.breakdown();
	application.view = application[view];
	$(this).parent().siblings().removeClass("active");
	$(this).parent().addClass("active");
	application.view.setup();
    });
});
