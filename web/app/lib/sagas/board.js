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
  UPDATE_BROWSER_HISTORY,
} = BoardActions;

function* fetchExams(action): Saga<void> {
  try {
    yield put(showLoading());
    const payload = yield call(Api.fetchExams, action.resourceGroup, action.resourceIds, action.date);
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
    const payload = yield call(Api.fetchKioskExams, action.resourceGroup, action.resourceIds);
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
    var exams;
    const [resourceGroups, {resource}] = yield [
      call(Api.fetchResourceGroups),
      call(Api.fetchSelectedResourceGroup),
    ];
    const resourceIds = R.keys(mapSelectedResources(resourceGroups[resource]));

    if (action.viewType === "kiosk") {
      exams = yield call(Api.fetchKioskExams, resource, resourceIds)
    } else {
      exams = yield call(Api.fetchExams, resource, resourceIds, action.date);
    }

    yield put(fetchResourcesSucceeded(resourceGroups, resource));
    yield put(fetchExamsSucceeded(exams));
  } catch (e) {
    yield call(requestFailed(e));
    console.log("error", e)
  } finally {
    yield put(hideLoading());
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

function* updateHistory(action): Saga<void> {
  yield history.pushState(action.state, action.title, action.path);
}

export default function* boardSaga(): Saga<void> {
  yield takeLatest(FETCH_EXAMS, fetchExams)
  yield takeLatest(FETCH_KIOSK_EXAMS, fetchKioskExams)
  yield takeLatest(FETCH_INITIAL_APP, fetchInitialApp)
  yield takeEvery(ADJUST_ORDER, adjustOrder)
  yield takeEvery(UPDATE_BROWSER_HISTORY, updateHistory)
}
