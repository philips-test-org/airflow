// @flow

import type {
  Order
} from "../../types";

const BoardActions = {
  FETCH_EXAMS: "FETCH_EXAMS",
  FETCH_EXAMS_SUCCEEDED: "FETCH_EXAMS_SUCCEEDED",
  // ORDER MODAL
  SHOW_ORDER_MODAL: "SHOW_ORDER_MODAL",
  CLOSE_ORDER_MODAL: "CLOSE_ORDER_MODAL",
}

// Action generator functions

const fetchExams = (resourceIds: Array<number>) => {
  return {
    type: BoardActions.FETCH_EXAMS,
    resourceIds,
  }
}

const fetchExamsSucceeded = (payload: Array<Order>) => {
  return {
    type: BoardActions.FETCH_EXAMS_SUCCEEDED,
    payload,
  }
}

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

export {
  BoardActions,
  fetchExams,
  fetchExamsSucceeded,
  showOrderModal,
  closeOrderModal,
}
