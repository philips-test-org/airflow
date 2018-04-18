// @flow
/* eslint no-console: 0 */

import * as R from "ramda";

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
  showLoading,
  hideLoading,
  fetchResourcesSucceeded,
} from "../actions";

import type {Saga} from "redux-saga";

import {mapSelectedResources} from "../../lib/utility";

const {
  ADJUST_ORDER,
  FETCH_EXAMS,
  FETCH_KIOSK_EXAMS,
  FETCH_INITIAL_APP,
} = BoardActions;

function* fetchExams(action): Saga<void> {
  try {
    yield put(showLoading());
    const payload = yield call(Api.fetchExams, action.resourceIds, action.date);
    yield put(fetchExamsSucceeded(payload));
    yield put(hideLoading());
  } catch (e) {
    yield call(requestFailed(e));
    console.log("error", e)
  }
}

function* fetchKioskExams(action): Saga<void> {
  try {
    yield put(showLoading());
    const payload = yield call(Api.fetchKioskExams, action.resourceIds);
    yield put(fetchExamsSucceeded(payload));
    yield put(hideLoading());
  } catch (e) {
    yield call(requestFailed(e));
    console.log("error", e)
  }
}

function* fetchInitialApp(action): Saga<void> {
  try {
    yield put(showLoading());

    const [resourceGroups, {resource}] = yield [
      call(Api.fetchResourceGroups),
      call(Api.fetchSelectedResourceGroup),
    ];

    const resourceIds = R.keys(mapSelectedResources(resourceGroups[resource]));

    const exams = action.viewType === "kiosk"
      ? yield call(Api.fetchKioskExams, resourceIds)
      : yield call(Api.fetchExams, resourceIds, action.date);

    yield put(fetchExamsSucceeded(exams));
    yield put(fetchResourcesSucceeded(resourceGroups, resource));

    yield put(hideLoading());
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
  yield takeLatest(FETCH_KIOSK_EXAMS, fetchKioskExams)
  yield takeLatest(FETCH_INITIAL_APP, fetchInitialApp)
  yield takeEvery(ADJUST_ORDER, adjustOrder)
}
