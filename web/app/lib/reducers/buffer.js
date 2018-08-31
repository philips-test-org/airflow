// @flow
import {
  append,
  contains,
  lensProp,
  merge,
  over,
} from "ramda";

import {BufferActions} from "../actions";

const {
  BUFFER_MESSAGE,
  RESET_BUFFER,
} = BufferActions;

type BufferState = {
  orders: Object,
  radExams: Object,
  misc: Array<Object>,
};

const OBJECT_BUFFERS = ["orders", "radExams"];

const initialState = {
  orders: {},
  radExams: {},
  misc: [],
};

function buffer(state: BufferState = initialState, action: Object) {
  switch (action.type) {
    case BUFFER_MESSAGE: return bufferMessage(state, action);
    case RESET_BUFFER: return initialState;
    default: return state;
  }
}

function bufferMessage(state, {queue, payload}) {
  const bufferLens = lensProp(queue);
  let updatedState = contains(queue, OBJECT_BUFFERS) ?
    over(bufferLens, merge({[payload.id]: payload}), state) :
    over(lensProp("misc"), append(payload), state);

  return updatedState;
}

export default buffer;
