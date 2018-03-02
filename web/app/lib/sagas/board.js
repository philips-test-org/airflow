// @flow
/* eslint no-console: 0 */

import {
  call,
  put,
  takeEvery,
  takeLatest,
} from "redux-saga/lib/effects";
import Api from "../api";

import {
  BoardActions,
  adjustOrderSucceeded,
  fetchExamsSucceeded,
  requestFailed,
} from "../actions";

import type {Saga} from "redux-saga";

const {
  ADJUST_ORDER,
  FETCH_EXAMS,
} = BoardActions;

function* fetchExams(action): Saga<void> {
  try {
    const payload = yield call(Api.fetchExams, action.resourceIds, action.date);
    yield put(fetchExamsSucceeded(payload));
  } catch (e) {
    yield call(requestFailed(e));
    console.log("error", e)
  }
}

function* adjustOrder(action): Saga<void> {
  try {
    const payload = yield call(Api.createEvent, action.event);
    yield put(adjustOrderSucceeded(action.event.order_id, payload));
  } catch (e) {
    yield call(requestFailed(e));
    console.log("error", e)
  }
}

export default function* boardSaga(): Saga<void> {
  yield takeLatest(FETCH_EXAMS, fetchExams)
  yield takeEvery(ADJUST_ORDER, adjustOrder)
}
