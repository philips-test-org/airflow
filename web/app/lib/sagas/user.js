// @flow
/* eslint no-console: 0 */

import {
  call,
  put,
  takeEvery,
} from "redux-saga/lib/effects";
import Api from "../api";

import {
  UserActions,
  fetchAvatarSucceeded,
} from "../actions";

import type {Saga} from "redux-saga";

const {
  FETCH_AVATAR,
} = UserActions;

function* fetchAvatar(action): Saga<void> {
  try {
    console.log(action)
    const payload = yield call(Api.fetchAvatar, action.userId);
    yield put(fetchAvatarSucceeded(action.userId, payload));
  } catch (e) {
    yield call(requestFailed(e));
    console.log("error", e)
  }
}

function* userSaga(): Saga<void> {
  yield takeEvery(FETCH_AVATAR, fetchAvatar);
}

export default userSaga;
