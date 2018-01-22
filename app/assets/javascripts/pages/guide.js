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

    //safari can't seem to handle focus
    $("#legend-button").click(function(){
        $("#legend-button").focus();
    });

    //Handling the search field entirely client-side
    //See data.js to add additional fields and adjust search logic
    $("#search-field").on('keyup',function(e) {
	var orders = application.data.search($("#search-field").val());
	$(".notecard").addClass("filtered");
	$.each(orders,function(i,order) { application.view.findCard(order).removeClass('filtered'); });
	if (orders.length == 1) {
	    var card = application.view.findCard(orders[0]);
	    application.view.board().scrollTo({top: card.position().top,
					       left: (card.parent().position().left)},500);
	}
    });

  connectToAPM();
});

function connectToAPM() {
  var amqp = new $.amqpListener();
  var apmHost = harbingerjsCometdURL.split("/")[2];
  amqp.setup({host: apmHost, port: 4000});

  var joinCallbacks = {
    newMsg: function(msg) {
      var routing_key = msg.routing_key;
      var exchange = msg.exchange;
      var payload = msg.payload;

      if (exchange === "web-application-messages" &&
          amqp.matchRoutingKey("airflow.#", routing_key)) {
        var tokens = routing_key.split("."),
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
          var event = payload.events.shift();
          if (event.event_type == "comment") {
            var event_type = "comment";
          } else {
            var event_type = "event";
          }
          application.notification.flash({type: event_type, event: event});
        }
      } else if (exchange === "audit") {
        application.auditBuffer.push(routing_key, msg.payload, msg.exchange);
      }
    },
    joinOk: function() {
      $("#notification-disconnect").remove();
      application.notification.flash("Connected to APM.");
      bindExchanges();
    },
    joinError: function(resp) {console.log("Unable to join", resp)},
    onClose: function() {
      application.notification.alert({
        type: "alert",
        id: "disconnect",
        message: "You are no longer receiving real time updates. This likely means you need to log in again. Reload if this message persists more than 10 seconds.",
      });
    }
  }

  function bindExchanges() {
    amqp.bindExchange("web-application-messages","airflow.#");
    amqp.bindExchange("audit","rad_exams.#");
    amqp.bindExchange("audit","rad_exam_times.#");
    amqp.bindExchange("audit","rad_exam_personnel.#");
    amqp.bindExchange("audit","orders.#")
  }

  amqp.connectToChannel(joinCallbacks)
}
