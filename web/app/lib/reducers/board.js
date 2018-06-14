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

const {
  ADJUST_ORDER_SUCCEEDED,
  FETCH_EXAMS_SUCCEEDED,
  FETCH_EXAM_SUCCEEDED,
  DISPATCH_NOTIFICATION,
  MARK_NOTIFICATION_DISPLAYED,
  FETCH_PERSON_EXAMS_SUCCEEDED,
  SHOW_ORDER_MODAL,
  CLOSE_ORDER_MODAL,
  SHOW_LOADING,
  HIDE_LOADING,
  FETCH_RESOURCES_SUCCEEDED,
  REPLACE_ORDER,
  UPDATE_DATE,
  UPDATE_VIEW_TYPE,
  UPDATE_WIDTH,
  UPDATE_SELECTED_RESOURCE_GROUP,
} = BoardActions;

const {
  REQUEST_FAILED,
} = GeneralActions;

const initialState = {
  orders: [],
  resources: {},
  notifications: [],
  selectedResourceGroup: "All",
  selectedResources: [],
  startDate: computeStartDate(),
  type: "calendar",
  loading: true,
  images: {},
  width: 0,
  examsByPerson: {},
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
    case FETCH_EXAMS_SUCCEEDED: return updateOrders(state, action);
    case FETCH_EXAM_SUCCEEDED: return upsertOrders(state, action);
    case FETCH_PERSON_EXAMS_SUCCEEDED: return updateExams(state, action);
    case SHOW_ORDER_MODAL: return showOrderModal(state, action);
    case CLOSE_ORDER_MODAL: return closeOrderModal(state, action);
    case SHOW_LOADING: return showLoading(state);
    case HIDE_LOADING: return hideLoading(state);
    case FETCH_RESOURCES_SUCCEEDED: return updateResources(state, action);
    case REPLACE_ORDER: return replaceOrder(state, action);
    case UPDATE_DATE: return updateDate(state, action);
    case UPDATE_SELECTED_RESOURCE_GROUP: return updateSelectedResourceGroup(state, action);
    case UPDATE_VIEW_TYPE: return updateViewType(state, action);
    case UPDATE_WIDTH: return updateWidth(state, action);
    case DISPATCH_NOTIFICATION: return dispatchNotification(state, action);
    case MARK_NOTIFICATION_DISPLAYED: return markNotificationDisplayed(state, action);
    case REQUEST_FAILED: return state;
    default: return state;
  }
}

function showOrderModal(state, {id}) {
  return R.merge(state, {showModal: true, focusedOrder: id});
}

function closeOrderModal(state, _action) {
  return R.merge(state, {showModal: false, focusedOrder: undefined});
}

function adjustOrder(state, {orderId, payload}) {
  const orderLens = R.lensPath(["orders", R.findIndex(R.propEq("id", orderId), state.orders)]);
  const eventLens = R.compose(orderLens, R.lensProp("events"));
  const adjustedLens = R.compose(orderLens, R.lensProp("adjusted"));
  return R.compose(
    R.over(eventLens, R.prepend(payload)),
    R.over(adjustedLens, R.mergeDeepLeft(payload.new_state)),
  )(state)
}

function upsertOrders(state, {payload}) {
  const orderIsInSelectedResources = (order, {selectedResources}) => (
    R.contains(getOrderResourceId(order), R.pluck("id", selectedResources))
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

  return R.merge(state, {
    orders: updatedOrders,
  });
}

function replaceOrder(state, {orderId, payload}) {
  const orderLens = R.lensIndex(R.findIndex(R.propEq("id", orderId), state.orders));
  const orderWithGroup = associateGroupIdentity(state.selectedResources, state.startDate, payload);

  const orders = R.set(orderLens, orderWithGroup, state.orders);
  return R.merge(state, {
    orders,
  });
}

function updateOrders(state, {payload}) {
  const payloadWithIdent = R.map(
    (order) => associateGroupIdentity(state.selectedResources, state.startDate, order),
    payload
  );
  return R.merge(state, {
    orders: payloadWithIdent,
  });
}

function updateExams(state, {personId, payload}) {
  const sortedExams = R.reverse(R.sortBy(R.path(["rad_exam_time", "end_exam"]), payload));

  return R.merge(state, {
    examsByPerson: R.merge(state.examsByPerson, {[personId]: sortedExams}),
  });
}

function showLoading(state) {
  return R.merge(state, {loading: true});
}

function hideLoading(state) {
  return R.merge(state, {loading: false});
}

function updateResources(state, {resources, selectedResourceGroup}) {
  return R.merge(state, {
    resources,
    selectedResourceGroup,
    selectedResources: resources[selectedResourceGroup],
  });
}

function updateDate(state, {date}) {
  return R.merge(state, {
    startDate: date,
  });
}

function updateSelectedResourceGroup(state, {resources, selectedResourceGroup}) {
  return R.merge(state, {
    selectedResourceGroup,
    selectedResources: resources[selectedResourceGroup],
  });
}

function updateViewType(state, {updatedView}) {
  return R.merge(state, {type: updatedView});
}

function updateWidth(state, {updatedWidth}) {
  return R.merge(state, {width: updatedWidth});
}

function computeStartDate(selectedDate = moment().unix()) {
  return moment(selectedDate * 1000).startOf("day").unix()*1000;
}

function dispatchNotification(state, action) {
  const mergeFn = (notificationList) => {
    const newNotifications = R.prepend(R.omit(["type"], action), notificationList);
    const uniqueNotifications = R.uniqBy(R.path(["event", "id"]), newNotifications);
    return R.merge(state, {notifications: uniqueNotifications});
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

const associateGroupIdentity = (selectedResources, startDate, payload) => R.assoc(
  "groupIdentity",
  groupIdentity(selectedResources, startDate, payload),
  payload,
);


export default board;
