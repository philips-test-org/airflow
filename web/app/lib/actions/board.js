// @flow

import type {
  Order
} from "../../types";

const BoardActions = {
  FETCH_EXAMS: "FETCH_EXAMS",
  FETCH_EXAMS_SUCCEEDED: "FETCH_EXAMS_SUCCEEDED",
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

export {
  BoardActions,
  fetchExams,
  fetchExamsSucceeded,
}
