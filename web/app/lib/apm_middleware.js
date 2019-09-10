//@flow

import * as R from "ramda";
import moment from "moment";
import amqpListener from "./amqp-listener-dist";
import I18n from 'i18next';

import {
  adjustOrderSucceeded,
  bufferEnqueue,
  dispatchNotification,
  flushBuffer,
} from "./actions";

import {
  getOrderResourceId,
  getOrderStartTime,
} from "./selectors";

const FLUSH_TIMEOUT = 2 * 1000;

const apmConnector = (store: Object) => (next: Function) => (action: Object) => {
  if (action.type !== "CONNECT_APM") return next(action);
  // Sets up the interval flushing for the audit message buffer.
  setInterval(() => {
    const {orders, radExams, misc} = store.getState().buffer;
    if (!R.all(R.isEmpty, [orders, radExams, misc])) {
      store.dispatch(flushBuffer());
    }
  }, FLUSH_TIMEOUT);
  connectToAPM(store);
}

function connectToAPM(store) {
  // $FlowFixMe
  var amqp = new amqpListener();
  // $FlowFixMe
  var apmHost = harbingerjsApmHost; // eslint-disable-line no-undef
  // $FlowFixMe
  var apmPort = harbingerjsApmPort; // eslint-disable-line no-undef
  amqp.setup({host: apmHost, port: apmPort});

  var joinCallbacks = {
    newMsg: (msg) => processMessage(msg, store, amqp),
    joinOk: function() {
      store.dispatch(dispatchNotification({
        type: "flash",
        event: {
          id: "connected-apm",
          event_type: "info",
          message: "Connected to APM",
          displayed: false,
        },
      }));
      bindExchanges();
    },
    joinError: alertError,
    onClose: alertDisconnected,
  }

  // After ES6 compatibility is added in React refactor, global variable will
  // be no more. An async/await refactor will clean this up.
  async function bindExchanges() {
    await amqp.bindExchange("web-application-messages","airflow.#", {ok: function() {}});
    await amqp.bindExchange("audit","rad_exams.#", {ok: function() {}});
    await amqp.bindExchange("audit","rad_exam_times.#", {ok: function() {}});
    await amqp.bindExchange("audit","rad_exam_personnel.#", {ok: function() {}});
    await amqp.bindExchange("audit","orders.#", {ok: function() {}});
    alertConnected();
  }

  function alertConnected(_queue) {
    store.dispatch(dispatchNotification({
      type: "flash",
      event: {
        id: "connected-queues",
        event_type: "info",
        message: "Receiving real-time data.",
        displayed: false,
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
          message: I18n.t('MESSAGE_RELOAD'),
          displayed: false,
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
        message: I18n.t('MESSAGE_REFRESH'),
        displayed: false,
      },
    }));
  }

  amqp.connectToChannel(joinCallbacks);
}

export function processMessage(msg: Object, store: Object, amqp: Object = new amqpListener()) {
  const routing_key = msg.routing_key;
  const exchange = msg.exchange;
  const payload = msg.payload;

  const tokens = routing_key.split(".");
  const table = tokens[0];
  const affected_id = tokens[2];

  const state = store.getState();
  const currentUser = R.path(["user", "currentUser", "id"], state);

  const orderIsInSelectedResources = (order, {board: {selectedResources}}) => (
    R.includes(parseInt(getOrderResourceId(order)), R.pluck("id", selectedResources))
  );

  const isToday = (order) => {
    const examstart = getOrderStartTime(order);
    return examstart == null ||
      moment(examstart).startOf("day").unix()*1000 == state.board.startDate;
  };

  if (exchange === "web-application-messages" && amqp.matchRoutingKey("airflow.#", routing_key)) {
    if (affected_id != currentUser && orderIsInSelectedResources(payload, state) && isToday(payload)) {
      const events = payload.events;
      const event = events.sort(function (x, y) {
        return new Date(y.updated_at) - new Date(x.updated_at);
      }).shift();

      store.dispatch(dispatchNotification({type: "flash", event: event}));
      store.dispatch(adjustOrderSucceeded(payload.id, payload.id, event));
    }
  } else if (exchange === "audit") {
    store.dispatch(bufferEnqueue(table, affected_id, payload));
  }
}

export default apmConnector;
