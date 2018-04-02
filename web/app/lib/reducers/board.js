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

const {
  ADJUST_ORDER_SUCCEEDED,
  FETCH_EXAMS_SUCCEEDED,
  SHOW_ORDER_MODAL,
  CLOSE_ORDER_MODAL,
} = BoardActions;

const {
  REQUEST_FAILED,
} = GeneralActions;

const initialState = {
  orders: [],
  orderGroups: {},
  resources: {},
  selectedResourceGroup: "All",
  selectedResources: [],
  startDate: computeStartDate(),
};

function board(state: Object = initialState, action: Object) {
  switch (action.type) {
  case "@@INIT": return R.merge(initialState, state);
  case ADJUST_ORDER_SUCCEEDED: return adjustOrder(state, action);
  case FETCH_EXAMS_SUCCEEDED: return updateOrders(state, action);
  case SHOW_ORDER_MODAL: return showOrderModal(state, action);
  case CLOSE_ORDER_MODAL: return closeOrderModal(state, action);
  case REQUEST_FAILED: return state;
  default: return state;
  }
}

function showOrderModal(state, {order}) {
  return R.merge(state, {showModal: true, focusedOrder: order.id});
}

function closeOrderModal(state, _action) {
  return R.merge(state, {showModal: false, focusedOrder: undefined});
}

function adjustOrder(state, {orderId, payload}) {
  const orderLens = R.lensPath(["orders", R.findIndex(R.propEq("id", orderId), state.orders)]);
  const eventLens = R.compose(orderLens, R.lensProp("events"));
  const adjustedLens = R.compose(orderLens, R.lensProp("adjusted"));
  return R.compose(
    R.set(R.lensProp("focusedOrder"), orderId),
    R.over(eventLens, R.prepend(payload)),
    R.over(adjustedLens, R.mergeDeepLeft(payload.new_state)),
  )(state)
}

function updateOrders(state, {payload}) {
  const payloadWithIdent = R.map((order) => (
    R.assoc("groupIdentity", groupIdentity(state.selectedResources, state.startDate, order), order)
  ), payload);
  return R.merge(state, {
    orders: payloadWithIdent,
    orderGroups: R.groupBy(R.prop("groupIdentity"), payloadWithIdent),
  });
}

function computeStartDate(selectedDate: number = moment().unix()) {
  return moment(selectedDate * 1000).startOf("day").unix()*1000;
}

export default board;
