// @flow
import moment from "moment";

import type {
  Order,
  Resource,
  ViewType,
  RadExam,
} from "../../types";

const BoardActions = {
  FETCH_EXAMS: "FETCH_EXAMS",
  FETCH_EXAMS_SUCCEEDED: "FETCH_EXAMS_SUCCEEDED",
  FETCH_KIOSK_EXAMS: "FETCH_KIOSK_EXAMS",
  FETCH_PERSON_EXAMS: "FETCH_PERSON_EXAMS",
  FETCH_PERSON_EXAMS_SUCCEEDED: "FETCH_PERSON_EXAMS_SUCCEEDED",
  // ORDER MODAL
  SHOW_ORDER_MODAL: "SHOW_ORDER_MODAL",
  CLOSE_ORDER_MODAL: "CLOSE_ORDER_MODAL",
  ADJUST_ORDER: "ADJUST_ORDER",
  ADJUST_ORDER_SUCCEEDED: "ADJUST_ORDER_SUCCEEDED",
  // UI
  SHOW_LOADING: "SHOW_LOADING",
  HIDE_LOADING: "HIDE_LOADING",
  UPDATE_BROWSER_HISTORY: "UPDATE_BROWSER_HISTORY",
  UPDATE_DATE: "UPDATE_DATE",
  UPDATE_VIEW_TYPE: "UPDATE_VIEW_TYPE",
  UPDATE_WIDTH: "UPDATE_WIDTH",
  UPDATE_SELECTED_RESOURCE_GROUP: "UPDATE_SELECTED_RESOURCE_GROUP",
  // Resources
  FETCH_INITIAL_APP: "FETCH_INITIAL_APP",
  FETCH_RESOURCES_SUCCEEDED: "FETCH_RESOURCES_SUCCEEDED",
}

// Action generator functions

const fetchExams = (resourceGroup: string, resourceIds: Array<number>, date: number = moment().unix()) => {
  return {
    type: BoardActions.FETCH_EXAMS,
    resourceGroup,
    resourceIds,
    date,
  }
}

const fetchKioskExams = (resourceGroup: string, resourceIds: Array<number>) => {
  return {
    type: BoardActions.FETCH_KIOSK_EXAMS,
    resourceGroup,
    resourceIds,
  }
}

const fetchExamsSucceeded = (payload: Array<Order>) => {
  return {
    type: BoardActions.FETCH_EXAMS_SUCCEEDED,
    payload,
  }
}

const fetchPersonExams = (personId: number) => {
  return {
    type: BoardActions.FETCH_PERSON_EXAMS,
    personId,
  }
}

const fetchPersonExamsSucceeded = (personId: number, payload: Array<RadExam>) => {
  return {
    type: BoardActions.FETCH_PERSON_EXAMS_SUCCEEDED,
    personId,
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

const updateBrowserHistory = (state: {viewType: ViewType}, title: string, path: string) => {
  return {
    type: BoardActions.UPDATE_BROWSER_HISTORY,
    state,
    title,
    path,
  }
}

const updateDate = (date: moment) => {
  return {
    type: BoardActions.UPDATE_DATE,
    date,
  }
}

const updateViewType = (updatedView: ViewType) => {
  return {
    type: BoardActions.UPDATE_VIEW_TYPE,
    updatedView,
  }
}

const updateWidth = (updatedWidth: number) => {
  return {
    type: BoardActions.UPDATE_WIDTH,
    updatedWidth,
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

const updateSelectedResourceGroup = (resources: {[string]: Array<Resource>}, selectedResourceGroup: string) => {
  return {
    type: BoardActions.UPDATE_SELECTED_RESOURCE_GROUP,
    resources,
    selectedResourceGroup,
  }
}

export {
  BoardActions,
  fetchExams,
  fetchExamsSucceeded,
  fetchKioskExams,
  fetchPersonExams,
  fetchPersonExamsSucceeded,
  adjustOrder,
  adjustOrderSucceeded,
  showOrderModal,
  closeOrderModal,
  showLoading,
  hideLoading,
  fetchInitialApp,
  fetchResourcesSucceeded,
  updateDate,
  updateViewType,
  updateBrowserHistory,
  updateSelectedResourceGroup,
  updateWidth,
}
