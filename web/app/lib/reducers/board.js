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
  SHOW_LOADING,
  HIDE_LOADING,
  FETCH_RESOURCES_SUCCEEDED,
  UPDATE_VIEW_TYPE,
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
  type: "calendar",
  loading: true,
  images: {},
}

function board(state: Object = initialState, action: Object) {
  // This is to merge the reducers initial state with the type
  // that gets passed in from the Rails side javascript.
  if (R.prop("hydrated", state) === false) {
    if (R.has("type", state)) {
      return R.merge(initialState, {type: state.type, hydrated: true})
    }
  }
  switch (action.type) {
  case ADJUST_ORDER_SUCCEEDED: return adjustOrder(state, action);
  case FETCH_EXAMS_SUCCEEDED: return updateOrders(state, action);
  case SHOW_ORDER_MODAL: return showOrderModal(state, action);
  case CLOSE_ORDER_MODAL: return closeOrderModal(state, action);
  case SHOW_LOADING: return showLoading(state);
  case HIDE_LOADING: return hideLoading(state);
  case FETCH_RESOURCES_SUCCEEDED: return updateResources(state, action);
  case UPDATE_VIEW_TYPE: return updateViewType(state, action);
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

function updateViewType(state, {updatedView}) {
  return R.merge(state, {type: updatedView});
}

function computeStartDate(selectedDate = moment().unix()) {
  return moment(selectedDate * 1000).startOf("day").unix()*1000;
}

export default board;
