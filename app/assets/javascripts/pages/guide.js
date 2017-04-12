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

	// Set up the now line including redrawing
	application.calendar.drawNow();
	setInterval(application.calendar.drawNow, 1 / application.templates.pixels_per_second * 1000);
	if ($("#right-now").css("display") != "none") {
	    $("#board").scrollTo({top: ($("#right-now").position().top - ($("#board").height()/2)), left: 0},500);
	}

	// Setup card events for all cards
	// this is done per card on redraw in the redrawCard function
	$(".notecard").draggable({revert: 'invalid',
				  cursor: 'move',
				  delay: 200});

	// Setup column events
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
		application.data.updateLocation(id,resource_id,notecard.position().top);
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
	var card = application.calendar.findCard(exam);
	var current_resource_id = card.parents("td").data("resource-id");
	var exam_resource_id = application.data.resource(exam).id;
	if (current_resource_id != exam_resource_id) {
	    card.appendTo($("#time-grid td[data-resource-id='" + exam_resource_id + "']"))
	    console.log("current and exam are different");
	}
	card.replaceWith(application.templates.scaledCard(exam));
	application.calendar.findCard(exam).draggable({revert: 'invalid',
						       cursor: 'move',
						       delay: 200});
	return card;
    },

    drawNow: function() {
	var now = new Date;
	var distance = Math.round(application.templates.pixels_per_second * (now.getHours() * 60 * 60 + now.getMinutes() * 60 + now.getSeconds()));
	if (distance > Math.round(application.templates.pixels_per_second * 24 * 60 * 60)) {
	    $("#right-now").hide();
	} else {
	    $("#right-now").css({top: 91 + distance}).show();
	    $("#right-now").css({width: $("#time-grid").width()});
	}
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
    function drawBoard() {
	//Fix: This needs to be adjusted to the group name when that backend exists
	var resources = $.parseJSON($("#resource-groupings-json").text())[$("#resource-group-buttons button").data("value")];
	var data = $.map(resources,function(r,i) {
	    return {name: "resource_ids[]",
		    value: r.id};
	});

	$.ajax($.harbingerjs.core.url("exams"),
	       {data: data,
		beforeSend: function() {
		    $("#workspace").html(application.templates.workspaceLoading());
		},
		success: function(exams) {
		    application.data.formatExams(exams);
		    application.view.setup();
		}});
    }

    if ($(".active .view-changer").length > 0) {
	var view = $(".active .view-changer").data("view-type");
	application.view = application[view];
    } else {
	application.view = application.calendar;
    }


    $("#workspace").on("click",".notecard",function(e) {
	var exam = application.data.findExam($(this).find(".data").data("exam-id"));
	application.modal.open(exam);
    });

    drawBoard();

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
	application.data.updateAttribute(exam_id,$(this).attr('name'),this.checked,["modal-update","exam-update"]);
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

    $("#view-controls #resource-group-buttons ul li a").click(function(e) {
	e.preventDefault();
	var group = $(this).data("value");
	if (group != $("#resource-group-buttons button").data("value")) {
	    $("#resource-group-buttons button .group-name").text(group);
	    $("#resource-group-buttons button").data("value",group);
	    drawBoard();
	}
    });
});
