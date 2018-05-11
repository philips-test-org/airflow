//@flow

import {
  dispatchNotification,
  fetchExam,
  replaceOrder,
} from "./actions";

const apmConnector = store => next => action => {
  if (action.type !== "CONNECT_APM") return next(action);
  connectToAPM(store);
}

function connectToAPM(store) {
  var amqp = new $.amqpListener();
  var apmHost = "sparkqa2.analytical.info";//harbingerjsApmHost;
  var apmPort = harbingerjsApmPort;
  amqp.setup({host: apmHost, port: apmPort});

  var joinCallbacks = {
    newMsg: function(msg) {
      const routing_key = msg.routing_key;
      const exchange = msg.exchange;
      const payload = msg.payload;

      const tokens = routing_key.split(".");
      const table = tokens[0];
      var event_type = tokens[1];
      const employee_id = tokens[2];
      const order_id = tokens[3];
      const resource_id = tokens[4];
      console.log(msg);

      if (exchange === "web-application-messages" && amqp.matchRoutingKey("airflow.#", routing_key)) {
        if (employee_id != application.employee.id) {
          const events = payload.events;
          const event = events.sort(function (x, y) {
            return new Date(y.updated_at) - new Date(x.updated_at);
          }).shift();

          if (event.event_type == "comment") {
            event_type = "comment";
          } else {
            event_type = "event";
          }
          store.dispatch(dispatchNotification({type: "flash", event: event}));
          store.dispatch(replaceOrder(payload.id, payload));
        }
      } else if (exchange === "audit") {
        // TODO - FIXME
        store.dispatch(fetchExam(payload.affected_row_id, table));
        //application.auditBuffer.push(routing_key, msg.payload, msg.exchange);
      }
    },
    joinOk: function() {
      $("#notification-disconnect").remove();
      store.dispatch(dispatchNotification({
        type: "flash",
        event: {
          id: "connected-apm",
          message: "Connected to APM",
        },
      }));
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
    store.dispatch(dispatchNotification({
      type: "flash",
      event: {
        id: "connected-queues",
        message: "Receiving real-time data.",
      },
    }));
  }

  function alertError(reason) {
    if (reason == "unauthorized") {
      store.dispatch(dispatchNotification({
        type: "alert",
        id: "disconnect",
        message: "You are no longer receiving real time updates. Please reload the page and log in again.",
      }));
    } else {
      alertDisconnected()
    }
  }

  function alertDisconnected() {
    store.dispatch(dispatchNotification({
      type: "alert",
      id: "disconnect",
      message: "You are no longer receiving real time updates. To ensure you have the most up-to-date data, please refresh if this message persists more than 10 seconds.",
    }));
  }

  amqp.connectToChannel(joinCallbacks);
}

export default apmConnector;
