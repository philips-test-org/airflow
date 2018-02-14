// @flow
import * as R from "ramda";
import moment from "moment";

import {
  groupIdentity,
  groupByIdentities,
} from "../data";

import {
  BoardActions,
} from "../actions";

const {
  FETCH_EXAMS_SUCCEEDED,
  SHOW_ORDER_MODAL,
  CLOSE_ORDER_MODAL,
} = BoardActions;

const initialState = {
  orders: [],
  orderGroups: {},
  resources: {},
  selectedResourceGroup: "All",
  selectedResources: null,
  startDate: moment().unix(),
};

function board(state: Object = initialState, action: Object) {
  switch (action.type) {
  case "@@INIT": return R.merge(initialState, state);
  case FETCH_EXAMS_SUCCEEDED: return updateOrders(state, action);
  case SHOW_ORDER_MODAL: return showOrderModal(state, action);
  case CLOSE_ORDER_MODAL: return closeOrderModal(state, action);
  default: return state;
  }
}

function showOrderModal(state, {order}) {
  return R.merge(state, {showModal: true, focusedOrder: order});
}

function closeOrderModal(state, {order}) {
  return R.merge(state, {showModal: false, focusedOrder: undefined});
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

export default board;
