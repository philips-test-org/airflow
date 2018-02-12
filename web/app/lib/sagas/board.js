// @flow
/* eslint no-console: 0 */

import {
  call,
  put,
  takeEvery,
} from "redux-saga/lib/effects";
import Api from "../api";

import {
  BoardActions,
  fetchExamsSucceeded,
  requestFailed,
} from "../actions";

import type {Saga} from "redux-saga";

const {
  FETCH_EXAMS,
} = BoardActions;

function* fetchExams(action): Saga<void> {
  try {
    const payload = yield call(Api.fetchExams, action.resourceIds);
    yield put(fetchExamsSucceeded(payload));
  } catch (e) {
    yield call(requestFailed(e));
    console.log("error", e)
  }
}

function* boardSaga(): Saga<void> {
  yield takeEvery(FETCH_EXAMS, fetchExams);
}

export default boardSaga;
