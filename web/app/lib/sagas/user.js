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
  UserActions,
  fetchAvatarSucceeded,
  fetchCurrentEmployeeSucceeded,
  requestFailed,
} from "../actions";

import type {Saga} from "redux-saga";

const {
  FETCH_AVATAR,
  FETCH_CURRENT_EMPLOYEE,
} = UserActions;

function* fetchAvatar(action): Saga<void> {
  try {
    const payload = yield call(Api.fetchAvatar, action.userId);
    yield put(fetchAvatarSucceeded(action.userId, payload));
  } catch (e) {
    yield call(requestFailed(e));
    console.log("error", e)
  }
}

function* fetchCurrentEmployee(): Saga<void> {
  try {
    const payload = yield call(Api.fetchCurrentEmployee);
    yield put(fetchCurrentEmployeeSucceeded(payload));
  } catch (e) {
    yield call(requestFailed(e));
    console.log("error", e)
  }
}

function* userSaga(): Saga<void> {
  yield takeEvery(FETCH_AVATAR, fetchAvatar);
  yield takeLatest(FETCH_CURRENT_EMPLOYEE, fetchCurrentEmployee);
}

export default userSaga;
