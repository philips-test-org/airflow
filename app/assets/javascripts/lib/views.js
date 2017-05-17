if (typeof application == "undefined") { application = {} }

application.drawBoard = function() {
    //Fix: This needs to be adjusted to the group name when that backend exists
    var resources = $.parseJSON($("#resource-groupings-json").text())[$("#resource-group-buttons button").data("value")];
    if (resources == undefined) {
	$("#workspace").html(application.templates.noResources());
    } else {
	var data = $.map(resources,function(r,i) {
	    return {name: "resource_ids[]",
		    value: r.id};
	});
	data.push({name: "date",
		   value: $("#time-button").data("value")});

	if ($(".active .view-changer").data("view-type") == "kiosk") { var url = $.harbingerjs.core.url("limited_exam_info"); }
	else {  var url = $.harbingerjs.core.url("exams"); }

	$.ajax(url,
	       {data: data,
		beforeSend: function() {
		    $("#workspace").html(application.templates.workspaceLoading());
		},
		success: function(exams) {
		    application.data.formatExams(exams);
		    application.view.setup();
		}});
    }
};


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


	application.data.hook("exam-update","card-redraw", function(exam) {
	    application.calendar.redrawCard(exam);
	});
	application.data.hook("exam-rollback","card-redraw", function(new_exam,rollback_back_exam) {
	    //console.log("Redrawing rolled back card",new_exam,rollback_back_exam);
	    application.calendar.redrawCard(rollback_back_exam);
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
	var exam_resource_id = application.data.resource(exam).id;

	if (card.length == 0) {
	    $("#time-grid td[data-resource-id='" + exam_resource_id + "']").append(application.templates.scaledCard(exam));
	    var card = application.calendar.findCard(exam);
	}
	var current_resource_id = card.parents("td").data("resource-id");
	var exam_resource_id = application.data.resource(exam).id;
	//console.log(current_resource_id,exam_resource_id);
	if (current_resource_id != exam_resource_id) {
	    card.appendTo($("#time-grid td[data-resource-id='" + exam_resource_id + "']"))
	    //console.log("current and exam are different");
	}
	card.replaceWith(application.templates.scaledCard(exam));
	application.calendar.findCard(exam).draggable({revert: 'invalid',
						       cursor: 'move',
						       delay: 200});
	return card;
    },

    drawNow: function() {
	if ($("#time-button").data("value") == undefined || moment($("#time-button").data("value")*1000).format('LL') == moment().format('LL')) {
	    var now = new Date;
	    var distance = Math.round(application.templates.pixels_per_second * (now.getHours() * 60 * 60 + now.getMinutes() * 60 + now.getSeconds()));
	    if (distance > Math.round(application.templates.pixels_per_second * 24 * 60 * 60)) {
		$("#right-now").hide();
	    } else {
		// subtract 1 from the distance to make up for the 2px line width
		$("#right-now").css({top: distance - 1}).show();
		$("#right-now").css({width: $("#time-grid").width()});
	    }
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
	var card = application.overview.findCard(exam);
	var exam_resource_id = application.data.resource(exam).id;

	if (card.length == 0) {
	    $(".resource-row[data-id='" + exam_resource_id + "']").append(application.templates.fixedCard(exam));
	    var card = application.overview.findCard(exam);
	} else {
	    card = card.replaceWith(application.templates.fixedCard(exam));
	}
	return card;
    }
}

// Kiosk "inherits" from application.calendar and overrides
// some of its functions
application.kiosk = $.extend({},application.calendar,{
    alignmentTimeout: null,
    setup: function() {
	//build calendar
	$("#workspace").html(application.templates.kiosk(application.data));

	//Make time and room headings scroll with calendar
	$("#board").scroll(function(e) {
	    var scroll = this.scrollLeft;
	    $("#time-headings").offset({left: -1*scroll+50});
	    $("#vertical-time-headings").css({left: scroll});
	    clearTimeout(application.kiosk.alignmentTimeout);
	    setTimeout(function() {
		var scroll_top = $("#board").scrollTop();
		$.each($("#board .notecard"),function(i,e) {
		    if ((($(e).position().top + $(e).height() / 3) <= scroll_top) && $(e).position().top < scroll_top) {
			$(e).find(".kiosk-number").addClass("bottom");
		    } else {
			$(e).find(".kiosk-number").removeClass("bottom");
		    }
		});
	    },200);
	});

	// Set up the now line including redrawing
	application.kiosk.drawNow();
	setInterval(application.kiosk.drawNow, 1 / application.templates.pixels_per_second * 1000);

	application.data.hook("exam-update","card-redraw",function(exam) {
	    application.kiosk.redrawCard(exam);
	});

    },

    redrawCard: function(exam) {
	var card = application.calendar.findCard(exam);
	var current_resource_id = card.parents("td").data("resource-id");
	var exam_resource_id = application.data.resource(exam).id;
	if (current_resource_id != exam_resource_id) {
	    card.appendTo($("#time-grid td[data-resource-id='" + exam_resource_id + "']"))
	}
	card.replaceWith(application.templates.scaledCard(exam));
	return card;
    },

    drawNow: function() {
	application.calendar.drawNow();
	if ($("#right-now").css("display") != "none") {
	    // To center the now line you need to
	    // get the now line's top and add the y axis scroll distance
	    // then subtract half the hight of the window
	    // Then set left to the the left position plus
	    // the x axis scroll distance to keep that scroll in place
	    $("#board").scrollTo({top: (($("#right-now").position().top + $("#board").scrollTop()) - ($("#board").height()/2)),
				  left: $("#board").position().left + $("#board").scrollLeft()},500);
	}
    }
});
