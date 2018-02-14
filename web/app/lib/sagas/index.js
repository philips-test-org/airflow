// @flow
import {all} from "redux-saga/effects";

import boardSaga from "./board";
import userSaga from "./user";

function* rootSaga() {
  yield all([
    boardSaga(),
    userSaga(),
  ])
}

export default rootSaga;
