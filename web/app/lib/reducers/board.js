// @flow
import * as R from "ramda";
import moment from "moment";

import {
  BoardActions,
} from "../actions";

const {
  FETCH_EXAMS_SUCCEEDED,
} = BoardActions;

const initialState = {
  orders: [],
  resources: [],
  selectedResource: "All",
  startDate: moment().unix(),
};

function board(state: Object = initialState, action: Object) {
  switch (action.type) {
  case "@@INIT":
    return R.merge(initialState, state);
  case FETCH_EXAMS_SUCCEEDED:
    return R.merge(state, {orders: action.payload});
  default:
    return state;
  }
}

export default board;
