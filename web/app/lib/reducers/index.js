// @flow
import {combineReducers} from "redux";
import board from "./board";
import user from "./user";
import calendar from "./calendar";

const rootReducer = combineReducers({
  board,
  user,
  calendar,
});

export default rootReducer;
