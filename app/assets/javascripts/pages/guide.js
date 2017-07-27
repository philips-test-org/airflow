$(document).ready(function() {

    if ($(".active .view-changer").length > 0) {
	var view =  $(".active .view-changer").data("view-type");
	application.view = application[view];
    } else {
	application.view = application.calendar;
    }

    application.drawBoard();

    $(".view-changer").click(function(e) {
	if ($(this).data("view-type") != "kiosk") {
	    e.preventDefault();
	    var view = $(this).data("view-type");
	    application.view.breakdown();
	    application.view = application[view];
	    $(this).parent().siblings().removeClass("active");
	    $(this).parent().addClass("active");
	    application.view.setup();
	}
    });

    $("#view-controls #resource-group-buttons ul li a").click(function(e) {
	e.preventDefault();
	var group = $(this).data("value");
	if (group != $("#resource-group-buttons button").data("value")) {
	    $("#resource-group-buttons button .group-name").text(group);
	    $("#resource-group-buttons button").data("value",group);
	    application.drawBoard();
	}
    });

    $("#view-controls #time-button").popover({
	title: "Select a date to show",
	content: application.templates.dateButtonPopover({}),
	html: true,
	placement: "bottom",
	container: $("body")
    });

    $("#time-button").on("inserted.bs.popover",function(e) {
	var set_epoch = $("#time-button").data("value");
	if (set_epoch != undefined) {  var date = moment(set_epoch*1000); }
	else { var date = moment() }
	$('#view-datepicker').datetimepicker({
            inline: true,
	    format: 'LL',
	    defaultDate: date
	});
	$("#view-datepicker").on("dp.change",function(e) {
	    $("#time-button").data("value",e.date.unix());
	    $("#time-button").html(e.date.format('dddd, LL') + ' <span class="caret"></span>');
	    $("#time-button").trigger("click");
	    application.drawBoard();
	});
	$("#today-button").on("click",function(e) {
	    e.preventDefault();
	    $("#time-button").data("value",moment().unix());
	    $("#time-button").html('Today <span class="caret"></span>');
	    $("#time-button").trigger("click");
	    application.drawBoard();
	});
    });

    $("#legend-button").popover({
	title: "Legend",
	content: application.templates.legend(application.statuses),
	html: true,
	placement: "bottom",
	container: 'body',
	trigger: 'focus'
    });

    //Add a disconnect callback
    $.harbingerjs.amqp.addCallback('disconnect',function(message) {
	application.notification.alert({type: "alert", id: "disconnect", message: "You are no longer receiving real time updates. This likely means you need to log in again. Reload the page to continue."});
    });

    //Add a connect callback
    $.harbingerjs.amqp.addCallback('connect',function(message) {
	$("#notification-disconnect").remove();
	application.notification.flash("Connected to real time data.");
    });

    $.harbingerjs.amqp.setup({url: harbingerjsCometdURL});

    $.harbingerjs.amqp.bind("web-application-messages","airflow.#")
    $.harbingerjs.amqp.bind("audit","rad_exams.#");
    $.harbingerjs.amqp.bind("audit","rad_exam_times.#");
    $.harbingerjs.amqp.bind("audit","rad_exam_personnel.#");
    $.harbingerjs.amqp.bind("audit","orders.#");

    $.harbingerjs.amqp.addListener(function(rk,payload,exchange) {
	var tokens = rk.split("."),
	    event_type = tokens[1],
	    employee_id = tokens[2],
	    order_id = tokens[3],
	    resource_id = tokens[4];
	if (employee_id != application.employee.id) {
	    application.data.update(order_id,function(order,rollback_id) {
		$.extend(order.adjusted,payload.adjusted);
		order.events = payload.events;
		return order;
	    },["order-update","modal-update"]);
	    var event = payload.events[payload.events.length-1];
	    if (event.event_type == "comment") {
		var event_type = "comment";
	    } else {
		var event_type = "event";
	    }
	    application.notification.flash({type: event_type, event: event});
	}
    },"airflow.#","web-application-messages");

    $.harbingerjs.amqp.addListener(function(rk,payload,exchange) {
	var tokens = rk.split("."),
	    table = tokens[0],
	    id = tokens[2];
	$.ajax($.harbingerjs.core.url("/exam_info"),
	       {data: {id: id,
		       table: table},
		beforeSend: function() {
		    //application.notification.flash("sending exam query for: " + rk);
		},
		success: function(orders) {
		    $.each(orders,function(i,o) {
			var r = application.data.resource(o);
			if (r != undefined && application.data.resourceHash[r.id] != undefined) {
			    if (application.data.orderGroups[application.data.orderGroupIdent(o)] == undefined) {
				application.data.insert(o);
				application.view.redrawCard(o);
			    } else {
				application.data.update(o.id,function(order,rollback_id) {
				    $.extend(order,o);
				    return order;
				},["order-update","modal-update"]);
			    }
			}
		    });
		    //application.notification.flash({type: 'info', message: (operation + " exam " +  exams[0].id)});
		}});
    },"#","audit");

});
