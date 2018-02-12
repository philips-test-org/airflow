// @flow
import {all} from "redux-saga/effects";

import boardSaga from "./board";

function* rootSaga() {
  yield all([
    boardSaga(),
  ])
}

export default rootSaga;
