// @flow
import * as R from "ramda";
import moment from "moment";

import {
  groupIdentity,
} from "../data";

import {
  BoardActions,
  GeneralActions,
} from "../actions";

import {getOrderResourceId} from "../selectors";

import type {Order} from "../../types";

const {
  ADJUST_ORDER_SUCCEEDED,
  PREADJUST_ORDER,
  ADD_EVENT,
  FETCH_EXAMS_SUCCEEDED,
  FETCH_EXAM_SUCCEEDED,
  DISPATCH_NOTIFICATION,
  MARK_NOTIFICATION_DISPLAYED,
  FETCH_PERSON_EXAMS_SUCCEEDED,
  FETCH_PERSON_EVENTS_SUCCEEDED,
  SHOW_ORDER_MODAL,
  CLOSE_ORDER_MODAL,
  SHOW_LOADING,
  HIDE_LOADING,
  REMOVE_ORDERS,
  REPLACE_ORDER,
  UPDATE_DATE,
  UPDATE_VIEW_TYPE,
  UPDATE_WIDTH,
  UPDATE_SELECTED_RESOURCE_GROUP,
  UPDATE_WIDTH_MULTIPLIER,
} = BoardActions;

const {
  REQUEST_FAILED,
} = GeneralActions;

const initialState = {
  orders: [],
  resources: {},
  notifications: [],
  selectedResourceGroup: "",
  selectedResources: [],
  startDate: computeStartDate(),
  type: "calendar",
  loading: true,
  images: {},
  width: 0,
  widthMultipliers: {},
  examsByPerson: {},
  personEvents: null,
}

function board(state: Object = initialState, action: Object) {
  // This is to merge the reducers initial state with the type
  // that gets passed in from the Rails side javascript.
  if (R.prop("hydrated", state) === false) {
    if (R.has("type", state)) {
      return R.mergeAll([initialState, state, {hydrated: true}]);
    }
  }

  switch (action.type) {
    case ADJUST_ORDER_SUCCEEDED: return adjustOrder(state, action);
    case PREADJUST_ORDER: return preAdjustOrder(state, action);
    case ADD_EVENT: return addEvent(state, action);
    case FETCH_EXAMS_SUCCEEDED: return updateOrders(state, action);
    case FETCH_EXAM_SUCCEEDED: return upsertOrders(state, action);
    case FETCH_PERSON_EXAMS_SUCCEEDED: return updateExams(state, action);
    case FETCH_PERSON_EVENTS_SUCCEEDED: return updatePersonEvents(state, action);
    case SHOW_ORDER_MODAL: return showOrderModal(state, action);
    case CLOSE_ORDER_MODAL: return closeOrderModal(state, action);
    case SHOW_LOADING: return showLoading(state);
    case HIDE_LOADING: return hideLoading(state);
    case REMOVE_ORDERS: return removeOrders(state, action);
    case REPLACE_ORDER: return replaceOrder(state, action);
    case UPDATE_DATE: return updateDate(state, action);
    case UPDATE_SELECTED_RESOURCE_GROUP: return updateSelectedResourceGroup(state, action);
    case UPDATE_VIEW_TYPE: return updateViewType(state, action);
    case UPDATE_WIDTH: return updateWidth(state, action);
    case DISPATCH_NOTIFICATION: return dispatchNotification(state, action);
    case MARK_NOTIFICATION_DISPLAYED: return markNotificationDisplayed(state, action);
    case UPDATE_WIDTH_MULTIPLIER: return updateWidthMultiplier(state, action);
    case REQUEST_FAILED: return state;
    default: return state;
  }
}

function showOrderModal(state, {id}) {
  return R.mergeRight(state, {showModal: true, focusedOrder: id});
}

function closeOrderModal(state, _action) {
  return R.mergeRight(state, {showModal: false, focusedOrder: undefined});
}

const makeOrderLens = (orders: Array<Order>, id: number) => (
  R.lensPath(["orders", R.findIndex(R.propEq("id", id), orders)])
);

function adjustOrder(state, {orderId, payload}) {
  // Update the "adjusted" and "events" keys or an order.
  const orderLens = makeOrderLens(state.orders, orderId);
  const order = R.view(orderLens, state);
  if (R.isNil(order)) return state;
  const adjustedState = preAdjustOrder(state, {orderId, payload});
  return addEvent(adjustedState, {orderId, payload});
}

function preAdjustOrder(state, {orderId, payload}) {
  // Update the "adjusted" key of an order.
  const orderLens = makeOrderLens(state.orders, orderId);
  const adjustedLens = R.compose(orderLens, R.lensProp("adjusted"));
  return R.over(adjustedLens, R.mergeDeepLeft(payload.new_state), state);
}

function addEvent(state, {orderId, payload}) {
  const orderLens = makeOrderLens(state.orders, orderId);
  const eventLens = R.compose(orderLens, R.lensProp("events"));
  return R.over(eventLens, R.prepend(payload), state);
}

function upsertOrders(state, {payload}) {
  const orderIsInSelectedResources = (order, {selectedResources}) => (
    R.includes(getOrderResourceId(order), R.pluck("id", selectedResources))
  );

  const updatedOrders = R.reduce((acc, order) => {
    if (!orderIsInSelectedResources(order, state)) return acc;
    const orderWithGroup = associateGroupIdentity(state.selectedResources, state.startDate, order);
    const orderLens = R.lensPath([R.findIndex(R.propEq("id", order.id), acc)]);
    if (!R.isNil(R.view(orderLens, acc))) {
      return R.set(orderLens, orderWithGroup, acc);
    }
    return R.append(orderWithGroup, acc);

  }, state.orders, payload);

  return R.mergeRight(state, {
    orders: updatedOrders,
  });
}

function replaceOrder(state, {orderId, payload}) {
  const orderLens = R.lensIndex(R.findIndex(R.propEq("id", orderId), state.orders));
  const orderWithGroup = associateGroupIdentity(state.selectedResources, state.startDate, payload);

  const orders = R.set(orderLens, orderWithGroup, state.orders);
  return R.mergeRight(state, {
    orders,
  });
}

function removeOrders(state, {orderIds}) {
  return R.mergeRight(state, {
    orders: state.orders.filter((order) => !orderIds.includes(order.id)),
  });
}

function updateOrders(state, {payload}) {
  const payloadWithIdent = R.map(
    (order) => associateGroupIdentity(state.selectedResources, state.startDate, order),
    payload
  );
  return R.mergeRight(state, {
    orders: payloadWithIdent,
  });
}

function updateExams(state, {personId, payload}) {
  const sortedExams = R.reverse(R.sortBy(R.path(["rad_exam_time", "end_exam"]), payload));

  return R.mergeRight(state, {
    examsByPerson: R.mergeRight(state.examsByPerson, {[personId]: sortedExams}),
  });
}

function updatePersonEvents(state, {payload}) {
  return R.mergeRight(state, {
    personEvents: payload,
  });
}

function showLoading(state) {
  return R.mergeRight(state, {loading: true});
}

function hideLoading(state) {
  return R.mergeRight(state, {loading: false});
}

function updateDate(state, {date}) {
  // Set to the start of the day. By default, react-dates does this already.
  return R.mergeRight(state, {
    startDate: date.startOf("day"),
  });
}

function updateSelectedResourceGroup(state, {resources, selectedResourceGroup}) {
  return R.mergeRight(state, {
    selectedResourceGroup,
    selectedResources: resources[selectedResourceGroup],
  });
}

function updateViewType(state, {updatedView}) {
  return R.mergeRight(state, {type: updatedView});
}

function updateWidth(state, {updatedWidth}) {
  return R.mergeRight(state, {width: updatedWidth});
}

function computeStartDate(selectedDate = moment().unix()) {
  return moment(selectedDate * 1000).startOf("day").unix()*1000;
}

function dispatchNotification(state, action) {
  const mergeFn = (notificationList) => {
    const newNotifications = R.prepend(R.omit(["type"], action), notificationList);
    const uniqueNotifications = R.uniqBy(R.path(["event", "id"]), newNotifications);
    return R.mergeRight(state, {notifications: uniqueNotifications});
  };

  if (R.path(["event", "id"], action) == "connected-apm") {
    let noDisconnectNotifications = R.reject(
      (notification) => notification.event.id == "disconnect",
      state.notifications
    );
    return mergeFn(noDisconnectNotifications);
  }
  return mergeFn(state.notifications);
}

function markNotificationDisplayed(state, {id}) {
  const notificationLens = R.lensPath([
    "notifications",
    R.findIndex((event) => R.pathSatisfies(R.equals(id), ["event", "id"], event), state.notifications),
    "event",
    "displayed",
  ]);
  return R.set(notificationLens, true, state);
}

function updateWidthMultiplier(state, {resourceId, widthMultiplier}) {
  const widthMultipliers = R.mergeRight(state.widthMultipliers, {[resourceId]: widthMultiplier});
  return R.mergeRight(state, {widthMultipliers});
}

const associateGroupIdentity = (selectedResources, startDate, payload) => R.assoc(
  "groupIdentity",
  groupIdentity(selectedResources, startDate, payload),
  payload,
);


export default board;
