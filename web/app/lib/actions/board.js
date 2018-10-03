// @flow
import moment from "moment";

import type {
  Notification,
  Order,
  Resource,
  ViewType,
  RadExam,
} from "../../types";

const BoardActions = {
  FETCH_EXAMS: "FETCH_EXAMS",
  FETCH_EXAMS_SUCCEEDED: "FETCH_EXAMS_SUCCEEDED",
  FETCH_EXAM: "FETCH_EXAM",
  FETCH_EXAM_SUCCEEDED: "FETCH_EXAM_SUCCEEDED",
  FETCH_KIOSK_EXAMS: "FETCH_KIOSK_EXAMS",
  FETCH_PERSON_EXAMS: "FETCH_PERSON_EXAMS",
  FETCH_PERSON_EXAMS_SUCCEEDED: "FETCH_PERSON_EXAMS_SUCCEEDED",
  FETCH_PERSON_EVENTS: "FETCH_PERSON_EVENTS",
  FETCH_PERSON_EVENTS_SUCCEEDED: "FETCH_PERSON_EVENTS_SUCCEEDED",
  // ORDER MODAL
  SHOW_ORDER_MODAL: "SHOW_ORDER_MODAL",
  CLOSE_ORDER_MODAL: "CLOSE_ORDER_MODAL",
  ADJUST_ORDER: "ADJUST_ORDER",
  PREADJUST_ORDER: "PREADJUST_ORDER",
  ADD_EVENT: "ADD_EVENT",
  ADJUST_ORDER_SUCCEEDED: "ADJUST_ORDER_SUCCEEDED",
  REPLACE_ORDER: "REPLACE_ORDER",
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
  // NOTIFICATIONS
  DISPATCH_NOTIFICATION: "DISPATCH_NOTIFICATION",
  MARK_NOTIFICATION_DISPLAYED: "MARK_NOTIFICATION_DISPLAYED",
  UPDATE_WIDTH_MULTIPLIER: "UPDATE_WIDTH_MULTIPLIER",
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

const fetchExam = (id: number, table: string) => {
  return {
    type: BoardActions.FETCH_EXAM,
    id,
    table,
  }
}

const fetchExamSucceeded = (payload: Array<Order>) => {
  return {
    type: BoardActions.FETCH_EXAM_SUCCEEDED,
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

const fetchPersonEvents = (mrnId: number) => {
  return {
    type: BoardActions.FETCH_PERSON_EVENTS,
    mrnId,
  }
}

const fetchPersonEventsSucceeded = (payload: ?Array<Event>) => {
  return {
    type: BoardActions.FETCH_PERSON_EVENTS_SUCCEEDED,
    payload,
  }
}

// ORDER MODAL

const showOrderModal = (id: string | number) => {
  return {
    type: BoardActions.SHOW_ORDER_MODAL,
    id,
  }
}

const closeOrderModal = () => {
  return {
    type: BoardActions.CLOSE_ORDER_MODAL,
  }
}

const adjustOrder = (event: Object, originatingId: string | number) => {
  return {
    type: BoardActions.ADJUST_ORDER,
    event,
    originatingId,
  }
}

const adjustOrderSucceeded = (orderId: number, originatingId: string | number, payload: Object) => {
  return {
    type: BoardActions.ADJUST_ORDER_SUCCEEDED,
    orderId,
    originatingId,
    payload,
  }
}

const preAdjustOrder = (orderId: number, payload: Object) => {
  return {
    type: BoardActions.PREADJUST_ORDER,
    payload,
    orderId,
  }
}

const addEvent = (orderId: number, payload: Object) => {
  return {
    type: BoardActions.ADD_EVENT,
    orderId,
    payload,
  }
}

const replaceOrder = (orderId: number, payload: Object) => {
  return {
    type: BoardActions.REPLACE_ORDER,
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

const updateSelectedResourceGroup = (resources: {[string]: Array<Resource>}, selectedResourceGroup: string) => {
  return {
    type: BoardActions.UPDATE_SELECTED_RESOURCE_GROUP,
    resources,
    selectedResourceGroup,
  }
}

// NOTIFICATIONS
const dispatchNotification = ({type, event}: Notification) => {
  return {
    type: BoardActions.DISPATCH_NOTIFICATION,
    event_type: type,
    event,
  }
}

const markNotificationDisplayed = (id: number | string) => {
  return {
    type: BoardActions.MARK_NOTIFICATION_DISPLAYED,
    id,
  }
}

const updateWidthMultiplier = (resourceId: number, widthMultiplier: number) => {
  return {
    type: BoardActions.UPDATE_WIDTH_MULTIPLIER,
    resourceId,
    widthMultiplier,
  }
}


export {
  BoardActions,
  fetchExams,
  fetchExamsSucceeded,
  fetchExam,
  fetchExamSucceeded,
  fetchKioskExams,
  fetchPersonExams,
  fetchPersonExamsSucceeded,
  fetchPersonEvents,
  fetchPersonEventsSucceeded,
  adjustOrder,
  addEvent,
  preAdjustOrder,
  adjustOrderSucceeded,
  showOrderModal,
  closeOrderModal,
  showLoading,
  hideLoading,
  fetchInitialApp,
  replaceOrder,
  updateDate,
  updateViewType,
  updateBrowserHistory,
  updateSelectedResourceGroup,
  updateWidth,
  dispatchNotification,
  markNotificationDisplayed,
  updateWidthMultiplier,
}
