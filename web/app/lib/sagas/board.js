// @flow
/* eslint no-console: 0 */

import * as R from "ramda";

import {
  all,
  call,
  put,
  takeEvery,
  takeLatest,
  select,
} from "redux-saga/lib/effects";
import Api from "../api";

import {
  BoardActions,
  addEvent,
  fetchExamsSucceeded,
  fetchExamSucceeded,
  fetchPersonExamsSucceeded,
  fetchPersonEvents,
  fetchPersonEventsSucceeded,
  requestFailed,
  showLoading,
  hideLoading,
  fetchResourcesSucceeded,
} from "../actions";

import type {Saga} from "redux-saga";

import {mapSelectedResources} from "../../lib";

const {
  ADJUST_ORDER,
  FETCH_EXAMS,
  FETCH_EXAM,
  FETCH_PERSON_EXAMS,
  FETCH_PERSON_EVENTS,
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

function* fetchExam(action): Saga<void> {
  try {
    const payload = yield call(Api.fetchExam, action.id, action.table);
    yield put(fetchExamSucceeded(payload));
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

function* fetchPersonExams(action): Saga<void> {
  try {
    const payload = yield call(Api.fetchPersonExams, action.personId);
    yield put(fetchPersonExamsSucceeded(action.personId, payload));
  } catch (e) {
    yield call(requestFailed(e));
    console.log("error", e)
  }
}

function* fetchPersonEventsSaga(action): Saga<void> {
  try {
    yield put(fetchPersonEventsSucceeded(null));
    const payload = yield call(Api.fetchPersonEvents, action.mrnId);
    yield put(fetchPersonEventsSucceeded(payload));
  } catch (e) {
    yield call(requestFailed(e));
    console.log("error", e)
  }
}

function* fetchInitialApp(action): Saga<void> {
  try {
    yield put(showLoading());
    var exams;
    const [resourceGroups, {resource}] = yield all([
      call(Api.fetchResourceGroups),
      call(Api.fetchSelectedResourceGroup),
    ]);
    if (R.length(R.keys(resourceGroups)) > 0) {
      const resourceIds = R.keys(mapSelectedResources(resourceGroups[resource]));

      if (action.viewType === "kiosk") {
        exams = yield call(Api.fetchKioskExams, resource, resourceIds)
      } else {
        exams = yield call(Api.fetchExams, resource, resourceIds, action.date);
      }
    } else {
      exams = [];
    }

    yield put(fetchResourcesSucceeded(resourceGroups, resource));
    yield put(fetchExamsSucceeded(exams));
  } catch (e) {
    yield call(requestFailed(e));
  } finally {
    yield put(hideLoading());
  }
}

function* adjustOrder(action): Saga<void> {
  try {
    let payload;
    if (R.type(action.event) == "Array") {
      payload = yield all(R.map(event => call(Api.createEvent, event), action.event));
      yield all(R.map(result => put(addEvent(result.order_id, result)), payload));
    } else {
      payload = yield call(Api.createEvent, action.event);
      yield put(addEvent(payload.order_id, payload));
    }

    // Refetch the patient history for this order's patient
    const orders = yield select((state) => state.board.orders);
    const order = orders.find((o) => o.id === payload.order_id);
    yield put(fetchPersonEvents(order.patient_mrn_id));
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
  yield takeEvery(FETCH_EXAM, fetchExam)
  yield takeLatest(FETCH_KIOSK_EXAMS, fetchKioskExams)
  yield takeLatest(FETCH_PERSON_EXAMS, fetchPersonExams)
  yield takeLatest(FETCH_PERSON_EVENTS, fetchPersonEventsSaga)
  yield takeLatest(FETCH_INITIAL_APP, fetchInitialApp)
  yield takeEvery(ADJUST_ORDER, adjustOrder)
  yield takeEvery(UPDATE_BROWSER_HISTORY, updateHistory)
}
