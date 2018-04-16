// @flow
import moment from "moment";

import type {
  Order
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

export {
  BoardActions,
  fetchExams,
  fetchExamsSucceeded,
  fetchKioskExams,
  adjustOrder,
  adjustOrderSucceeded,
  showOrderModal,
  closeOrderModal,
}
