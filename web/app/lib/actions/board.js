// @flow
import moment from "moment";

import type {
  Order,
  Resource,
  ViewType,
} from "../../types";

const BoardActions = {
  FETCH_EXAMS: "FETCH_EXAMS",
  FETCH_EXAMS_SUCCEEDED: "FETCH_EXAMS_SUCCEEDED",
  FETCH_KIOSK_EXAMS: "FETCH_KIOSK_EXAMS",
  // ORDER MODAL
  SHOW_ORDER_MODAL: "SHOW_ORDER_MODAL",
  CLOSE_ORDER_MODAL: "CLOSE_ORDER_MODAL",
  ADJUST_ORDER: "ADJUST_ORDER",
  ADJUST_ORDER_SUCCEEDED: "ADJUST_ORDER_SUCCEEDED",
  // UI
  SHOW_LOADING: "SHOW_LOADING",
  HIDE_LOADING: "HIDE_LOADING",
  UPDATE_BROWSER_HISTORY: "UPDATE_BROWSER_HISTORY",
  UPDATE_VIEW_TYPE: "UPDATE_VIEW_TYPE",
  // Resources
  FETCH_INITIAL_APP: "FETCH_INITIAL_APP",
  FETCH_RESOURCES_SUCCEEDED: "FETCH_RESOURCES_SUCCEEDED",
}

// Action generator functions

const fetchExams = (resourceIds: Array<number>, date: number = moment().unix()) => {
  return {
    type: BoardActions.FETCH_EXAMS,
    resourceIds,
    date,
  }
}

const fetchKioskExams = (resourceIds: Array<number>) => {
  return {
    type: BoardActions.FETCH_KIOSK_EXAMS,
    resourceIds,
  }
}

const fetchExamsSucceeded = (payload: Array<Order>) => {
  return {
    type: BoardActions.FETCH_EXAMS_SUCCEEDED,
    payload,
  }
}

// ORDER MODAL

const showOrderModal = (order: Order) => {
  return {
    type: BoardActions.SHOW_ORDER_MODAL,
    order,
  }
}

const closeOrderModal = () => {
  return {
    type: BoardActions.CLOSE_ORDER_MODAL,
  }
}

const adjustOrder = (event: Object) => {
  return {
    type: BoardActions.ADJUST_ORDER,
    event,
  }
}

const adjustOrderSucceeded = (orderId: number, payload: Object) => {
  return {
    type: BoardActions.ADJUST_ORDER_SUCCEEDED,
    orderId,
    payload,
  }
}

// UI

const showLoading = () => {
  return {
    type: BoardActions.SHOW_LOADING,
  }
}

const hideLoading = () => {
  return {
    type: BoardActions.HIDE_LOADING,
  }
}

const updateBrowserHistory = (title: string, path: string) => {
  return {
    type: BoardActions.UPDATE_BROWSER_HISTORY,
    title,
    path,
  }
}

const updateViewType = (updatedView: ViewType) => {
  return {
    type: BoardActions.UPDATE_VIEW_TYPE,
    updatedView,
  }
}

// Resources

const fetchInitialApp = (viewType: ViewType, date: number = moment().unix()) => {
  return {
    type: BoardActions.FETCH_INITIAL_APP,
    viewType: viewType,
    date,
  }
}

const fetchResourcesSucceeded = (resources: {[string]: Array<Resource>}, selectedResourceGroup: string) => {
  return {
    type: BoardActions.FETCH_RESOURCES_SUCCEEDED,
    resources,
    selectedResourceGroup,
  }
}

export {
  BoardActions,
  fetchExams,
  fetchExamsSucceeded,
  fetchKioskExams,
  adjustOrder,
  adjustOrderSucceeded,
  showOrderModal,
  closeOrderModal,
  showLoading,
  hideLoading,
  fetchInitialApp,
  fetchResourcesSucceeded,
  updateViewType,
  updateBrowserHistory,
}
