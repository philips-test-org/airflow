// @flow
import {all} from "redux-saga/effects";

import boardSaga from "./board";
import userSaga from "./user";

import type {Saga} from "redux-saga";

function* rootSaga(): Saga<void> {
  yield all([
    boardSaga(),
    userSaga(),
  ])
}

export default rootSaga;
