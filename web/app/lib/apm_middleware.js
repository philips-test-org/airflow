//@flow

import * as R from "ramda";

import {
  dispatchNotification,
  fetchExam,
  replaceOrder,
} from "./actions";

const apmConnector = (store: Object) => (next: Function) => (action: Object) => {
  if (action.type !== "CONNECT_APM") return next(action);
  connectToAPM(store);
}

function connectToAPM(store) {
  // $FlowFixMe
  var amqp = new $.amqpListener();
  // $FlowFixMe
  var apmHost = harbingerjsApmHost; // eslint-disable-line no-undef
  // $FlowFixMe
  var apmPort = harbingerjsApmPort; // eslint-disable-line no-undef
  amqp.setup({host: apmHost, port: apmPort});

  var joinCallbacks = {
    newMsg: function(msg) {
      const routing_key = msg.routing_key;
      const exchange = msg.exchange;
      const payload = msg.payload;

      const tokens = routing_key.split(".");
      const table = tokens[0];
      const employee_id = tokens[2];

      const currentUser = R.path(["user", "currentUser", "id"], store.getState());

      if (exchange === "web-application-messages" && amqp.matchRoutingKey("airflow.#", routing_key)) {
        if (employee_id != currentUser) {
          const events = payload.events;
          const event = events.sort(function (x, y) {
            return new Date(y.updated_at) - new Date(x.updated_at);
          }).shift();

          store.dispatch(dispatchNotification({type: "flash", event: event}));
          store.dispatch(replaceOrder(payload.id, payload));
        }
      } else if (exchange === "audit") {
        store.dispatch(fetchExam(payload.affected_row_id, table));
      }
    },
    joinOk: function() {
      $("#notification-disconnect").remove();
      store.dispatch(dispatchNotification({
        type: "flash",
        event: {
          id: "connected-apm",
          event_type: "info",
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
    amqp.bindExchange("audit","orders.#", {ok: function() {BOUND +=1}});
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

  function alertConnected(_queue) {
    store.dispatch(dispatchNotification({
      type: "flash",
      event: {
        id: "connected-queues",
        event_type: "info",
        message: "Receiving real-time data.",
      },
    }));
  }

  function alertError(reason) {
    if (reason == "unauthorized") {
      store.dispatch(dispatchNotification({
        type: "alert",
        event: {
          id: "disconnect",
          event_type: "alert",
          message: "You are no longer receiving real time updates. Please reload the page and log in again.",
        },
      }));
    } else {
      alertDisconnected()
    }
  }

  function alertDisconnected() {
    store.dispatch(dispatchNotification({
      type: "alert",
      event: {
        id: "disconnect",
        event_type: "alert",
        message: "You are no longer receiving real time updates. To ensure you have the most up-to-date data, please refresh if this message persists more than 10 seconds.",
      },
    }));
  }

  amqp.connectToChannel(joinCallbacks);
}

export default apmConnector;
