// @flow
import {combineReducers} from "redux";
import board from "./board";
import session from "./session";
import user from "./user";

const rootReducer = combineReducers({
  board,
  session,
  user,
});

export default rootReducer;
