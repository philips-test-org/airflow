// @flow
import {combineReducers} from "redux";
import board from "./board";
import buffer from "./buffer";
import user from "./user";

const rootReducer = combineReducers({
  board,
  buffer,
  user,
});

export default rootReducer;
