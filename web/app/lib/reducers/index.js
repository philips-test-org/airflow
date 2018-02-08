// @flow
import {combineReducers} from "redux";
import board from "./board";
import calendar from "./calendar";

const rootReducer = combineReducers({
  board,
  calendar,
});

export default rootReducer;
