// @flow
import moment from "moment";

const initialState = {
  orders: [],
  startDate: moment().unix(),
};

function board(state: Object = initialState, action: Object) {
  switch (action.type) {
  default:
    return state;
  }
}

export default board;
