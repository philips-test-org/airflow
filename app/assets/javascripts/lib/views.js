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

	if ($(".active .view-changer").data("view-type") == "kiosk") { var url = $.harbingerjs.core.url("/limited_exam_info"); }
	else {  var url = $.harbingerjs.core.url("/exams"); }

	$.ajax(url,
	       {data: data,
		beforeSend: function() {
		    $("#workspace").html(application.templates.workspaceLoading());
		},
		success: function(orders) {
		    application.data.formatOrders(orders);
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
		if ($(e.originalEvent.target).hasClass("notecard")) {
		    var notecard = $(e.originalEvent.target);
		} else {
		    var notecard = $(e.originalEvent.target).parents(".notecard");
		}
		var id = notecard.find(".data").data("order-id");
		var resource_id = column.data("resource-id");

		application.data.updateLocation(id,resource_id,notecard.position().top);
	    }});


	application.data.hook("order-update","card-redraw", function(order) {
	    application.calendar.redrawCard(order);
	});
	application.data.hook("order-rollback","card-redraw", function(new_order,rollback_back_order) {
	    //console.log("Redrawing rolled back card",new_order,rollback_back_order);
	    application.calendar.redrawCard(rollback_back_order);
	});

    },
    breakdown: function() {
	application.data.unhook("order-update","card-redraw");
    },
    findCard: function(order) {
	return $("#scaled-card-" + order.id);
    },
    redrawCard: function(order) {
	var card = application.calendar.findCard(order);
	var order_resource_id = application.data.resource(order).id;

	if (card.length == 0) {
	    $("#time-grid td[data-resource-id='" + order_resource_id + "']").append(application.templates.scaledCard(order));
	    var card = application.calendar.findCard(order);
	}
	var current_resource_id = card.parents("td").data("resource-id");
	var order_resource_id = application.data.resource(order).id;
	//console.log(current_resource_id,order_resource_id);
	if (current_resource_id != order_resource_id) {
	    card.appendTo($("#time-grid td[data-resource-id='" + order_resource_id + "']"))
	    //console.log("current and order are different");
	}
	card.replaceWith(application.templates.scaledCard(order));
	application.calendar.findCard(order).draggable({revert: 'invalid',
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

	application.data.hook("order-update","card-redraw",function(order) {
	    application.overview.redrawCard(order);
	});

	$("#relative-board .resource-row").width($("#relative-board")[0].scrollWidth);

	$("#workspace #relative-board").scroll(function(e) {
	    var scroll = this.scrollLeft;
	    $(this).find(".resource-row>h1").css({left: scroll - 48});
	});

    },
    breakdown: function() {
	application.data.unhook("order-update","card-redraw");
    },
    findCard: function(order) {
	return $("#fixed-card-" + order.id);
    },
    redrawCard: function(order) {
	var card = application.overview.findCard(order);
	var order_resource_id = application.data.resource(order).id;

	if (card.length == 0) {
	    $(".resource-row[data-id='" + order_resource_id + "']").append(application.templates.fixedCard(order));
	    var card = application.overview.findCard(order);
	} else {
	    card = card.replaceWith(application.templates.fixedCard(order));
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

	application.data.hook("order-update","card-redraw",function(order) {
	    application.kiosk.redrawCard(order);
	});

    },

    redrawCard: function(order) {
	var card = application.calendar.findCard(order);
	var current_resource_id = card.parents("td").data("resource-id");
	var order_resource_id = application.data.resource(order).id;
	if (current_resource_id != order_resource_id) {
	    card.appendTo($("#time-grid td[data-resource-id='" + order_resource_id + "']"))
	}
	card.replaceWith(application.templates.scaledCard(order));
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
