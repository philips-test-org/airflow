// @flow
import {connect} from "react-redux";
import {createSelector} from "reselect";
import * as R from "ramda";
import moment from "moment";

import {
  cardStatuses,
  getOrderResourceId,
  getOrderStartTime,
  getOrderingPhysician,
  getPatientMrn,
  getPatientName,
  getProcedure,
  hasComments,
  mapSelectedResources,
  ordersByResource,
  orderStopTime,
} from "../../lib";

import {
  adjustOrder,
  connectAPM,
  fetchAvatar,
  fetchExams,
  fetchKioskExams,
  fetchPersonExams,
  fetchPersonEvents,
  fetchInitialApp,
  fetchCurrentEmployee,
  showOrderModal,
  closeOrderModal,
  markNotificationDisplayed,
  preAdjustOrder,
  redirectToSSO,
  removeOrders,
  showLoading,
  updateBrowserHistory,
  updateDate,
  updateViewType,
  updateWidth,
  updateSelectedResourceGroup,
  updateWidthMultiplier,
} from "../../lib/actions";

import Airflow from "./Airflow";

import type {
  Resource,
  ViewType,
} from "../../types";

// Memoized selectors to avoid frequent recomputation of state.
const getOrders = (state) => state.board.orders;
const getStartDate = (state) => state.board.startDate;
const getSelectedResourceGroup = (state) => state.board.selectedResources;


const getGroupedOrders = createSelector(
  [getOrders],
  (orders) => R.groupBy(R.prop("groupIdentity"), orders),
)

const getMergedOrders = createSelector(
  [getGroupedOrders, getStartDate],
  (orders, startDate) => mergeGroupedOrders(orders, startDate),
)

const getOrdersByResource = createSelector(
  [getOrders],
  (orders) => ordersByResource(orders),
)

const getMergedOrdersByResource = createSelector(
  [getMergedOrders],
  (orders) => ordersByResource(orders),
)

const getMappedSelectedResourceGroup = createSelector(
  [getSelectedResourceGroup],
  (resourceGroup) => mapSelectedResources(resourceGroup),
)

// Props mapping
const mapStateToProps = (state: Object) => {
  const {board, user} = state;
  const orderGroups = getGroupedOrders(state);
  const mergedByGroup = getMergedOrders(state);
  return {
    avatarMap: user.avatars,
    boardWidth: board.width,
    currentUser: user.currentUser,
    examsByPerson: board.examsByPerson,
    focusedOrder: findFocusedOrder(board.focusedOrder, mergedByGroup),
    images: board.images,
    loading: board.loading,
    notifications: board.notifications,
    orderGroups,
    orders: getOrdersByResource(state),
    ordersMergedByGroup: getMergedOrdersByResource(state),
    ordersLoaded: !R.isEmpty(board.orders),
    resources: board.resources,
    selectedResourceGroup: board.selectedResourceGroup,
    selectedResources: getMappedSelectedResourceGroup(state),
    showModal: board.showModal,
    ssoUrl: user.ssoUrl,
    startDate: board.startDate,
    type: board.type,
    widthMultipliers: board.widthMultipliers,
    personEvents: board.personEvents,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    adjustOrder: (event: Object, originatingId: string | number) => {
      const {order_id} = event;
      if (typeof order_id == "string") {
        const ids = R.compose(R.map(parseInt), R.split("-"))(order_id);
        // Generate a list of events, one/order in a merged card.
        const events = R.map((id) => Object.assign({}, event, {order_id: id}), ids);
        // Preadjust all the orders for a merged card.
        R.forEach((id) => {dispatch(preAdjustOrder(id, event))}, ids);
        // Adjust all orders for merged card.
        dispatch(adjustOrder(events, originatingId));
      } else {
        dispatch(preAdjustOrder(order_id, event));
        dispatch(adjustOrder(event, originatingId));
      }
    },
    connectAPM: () => {
      dispatch(connectAPM());
    },
    fetchAvatar: (userId: number) => {
      dispatch(fetchAvatar(userId));
    },
    fetchExams: (selectedResourceGroup: string, resources: Array<number>, date: number) => {
      dispatch(fetchExams(selectedResourceGroup, resources, date));
    },
    fetchKioskExams: (selectedResourceGroup: string, resources: Array<number>) => {
      dispatch(fetchKioskExams(selectedResourceGroup, resources));
    },
    fetchPersonExams: (personId: number) => {
      dispatch(fetchPersonExams(personId));
    },
    fetchPersonEvents: (mrnId: number) => {
      dispatch(fetchPersonEvents(mrnId));
    },
    fetchInitialApp: (type: ViewType, date: number) => {
      dispatch(fetchInitialApp(type, date));
    },
    fetchCurrentEmployee: () => {
      dispatch(fetchCurrentEmployee());
    },
    openModal: (id: string | number) => {
      dispatch(showOrderModal(id));
    },
    closeModal: () => {
      dispatch(closeOrderModal());
    },
    markNotificationDisplayed: (id: number | string) => {
      dispatch(markNotificationDisplayed(id))
    },
    redirectToSSO: (ssoUrl: string, viewType: ViewType) => {
      dispatch(showLoading());
      dispatch(redirectToSSO(ssoUrl, viewType));
    },
    removeOrders: (orderIds: Array<number>) => {
      dispatch(removeOrders(orderIds));
    },
    updateBrowserHistory: (state: {viewType: ViewType}, title: string, path: string) => {
      dispatch(updateBrowserHistory(state, title, path));
    },
    updateDate: (date: moment) => {
      dispatch(updateDate(date));
    },
    updateViewType: (updatedView: ViewType) => {
      dispatch(updateViewType(updatedView));
    },
    updateWidth: (updatedWidth: number) => {
      dispatch(updateWidth(updatedWidth));
    },
    updateSelectedResourceGroup: (resources: {[string]: Array<Resource>}, selectedResourceGroup: string) => {
      dispatch(updateSelectedResourceGroup(resources, selectedResourceGroup));
    },
    updateWidthMultiplier: (resourceId: number, widthMultiplier: number) => {
      dispatch(updateWidthMultiplier(resourceId, widthMultiplier));
    },
  }
};

function mergeGroupedOrders(groupIdentities, startDate) {
  const valsOrMerge = (vals) => {
    //if (vals.length > 1) debugger;
    return vals.length == 1 ? R.assoc("merged", false, vals[0]) : [innerMerge(vals, startDate)]
  };
  return R.compose(
    R.flatten,
    R.map(valsOrMerge),
    R.values
  )(groupIdentities);
}

const innerMerge = (vals, startDate) => {
  const orderAcc = {
    adjusted: {start_time: null},
    events: [],
    hasComments: false,
    id: null,
    merged: true,
    orders: [],
    patientMrn: null,
    patientName: null,
    procedures: [],
    resourceId: null,
    startTime: null,
    stopTime: null,
    cardStatus: null,
    groupIdentity: null,
  }

  return R.reduce((acc, order) => {
    acc.adjusted = R.mergeWith((a, o) => a || o, acc.adjusted, order.adjusted)
    acc.events = R.sortBy(
      R.prop("id"),
      R.concat(acc.events,
        R.map(R.assoc("orderNumber", order.order_number), order.events)
      )
    ).reverse();
    acc.hasComments = acc.hasComments || hasComments(order)
    if (!acc.patientName) {
      acc.patientName = getPatientName(order)
    }
    if (!acc.patientMrn) {
      acc.patientMrn = getPatientMrn(order)
    }
    // Setting to the last order's id to make card keys and OrderModal work.
    acc.id = !acc.id ? `${order.id}` : `${order.id}-${acc.id}`;
    acc.procedures = R.append({
      orderedBy: getOrderingPhysician(order),
      procedure: getProcedure(order),
    }, acc.procedures)
    acc.orders = R.append(order, acc.orders)
    acc.resourceId = acc.resourceId || getOrderResourceId(order)
    acc.startTime = acc.startTime == null ?
      getOrderStartTime(order) :
      R.min(acc.startTime, getOrderStartTime(order))
    acc.stopTime = R.max(acc.stopTime, orderStopTime(startDate, order))
    acc.groupIdentity = acc.groupIdentity || order.groupIdentity;

    if (!acc.cardStatus) {
      acc.cardStatus = cardStatuses(order, ["name", "color", "card_class", "order"], {color: "#ddd"});
    } else {
      let orderStatus = cardStatuses(order, ["name", "color", "card_class", "order"], {color: "#ddd"})
      acc.cardStatus = R.maxBy(R.prop("order"), acc.cardStatus, orderStatus)
    }
    return acc;
  }, orderAcc, vals)
}

const findFocusedOrder = (id, mergedOrders) => (
  R.find(R.propEq("id", id), mergedOrders)
)

const AirflowContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Airflow);

export default AirflowContainer;
