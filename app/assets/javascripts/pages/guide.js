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
      application.view = application[view];
      $(this).parent().siblings().removeClass("active");
      $(this).parent().addClass("active");
      application.drawBoard();
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

  connectToAPM();
});

function connectToAPM() {
  var amqp = new $.amqpListener();
  var apmHost = harbingerjsApmHost;
  var apmPort = harbingerjsApmPort;
  amqp.setup({host: apmHost, port: apmPort});

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
          var events = payload.events;
          var event = events.sort(function (x, y) {
            return new Date(y.updated_at) - new Date(x.updated_at);
          }).shift();
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
    joinError: alertError,
    onClose: alertDisconnected,
  }

  // After ES6 compatibility is added in React refactor, global variable will
  // be no more. An async/await refactor will clean this up.
  var BOUND = 0;
  function bindExchanges() {
    amqp.bindExchange("web-application-messages","airflow.#", {ok: function() {BOUND += 1}});
    amqp.bindExchange("audit","rad_exams.#", {ok: function() {BOUND += 1}});
    amqp.bindExchange("audit","rad_exam_times.#", {ok: function() {BOUND += 1}});
    amqp.bindExchange("audit","rad_exam_personnel.#", {ok: function() {BOUND += 1}});
    amqp.bindExchange("audit","orders.#", {ok: function() {BOUND +=1}})
    waitOnBind();
  }

  function waitOnBind() {
    setTimeout(function() {
      if (BOUND == 5) {
        alertConnected();
      } else {
        waitOnBind();
      }
    }, 1000)
  }

  function alertConnected(queue) {
    application.notification.flash("Receiving real-time data.");
  }

  function alertError(reason) {
    if (reason == "unauthorized") {
      application.notification.alert({
        type: "alert",
        id: "disconnect",
        message: "You are no longer receiving real time updates. Please reload the page and log in again.",
      })
    } else {
      alertDisconnected()
    }
  }

  function alertDisconnected() {
    application.notification.alert({
      type: "alert",
      id: "disconnect",
      message: "You are no longer receiving real time updates. To ensure you have the most up-to-date data, please refresh if this message persists more than 10 seconds.",
    });
  }

  amqp.connectToChannel(joinCallbacks)
}
