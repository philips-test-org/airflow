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

import {APP_ROOT} from "../constants";

import {
  GeneralActions,
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

const {
  REDIRECT_TO_SSO,
} = GeneralActions;


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

function* redirectToSSO({ssoUrl, viewType}): Saga<void> {
  var origin = document.location.origin;
  var redirectTo;
  if (viewType == "calendar") {
    redirectTo = `${origin}${APP_ROOT}/main/calendar`;
  } else {
    redirectTo = `${origin}${APP_ROOT}/main/overview`;
  }
  if (!R.empty(ssoUrl)) {
    window.location = `${ssoUrl}/UI/Login?goto=${encodeURIComponent(redirectTo)}`;
  } else {
    console.warn("No SSO Url set.")
  }
  yield;
}

function* userSaga(): Saga<void> {
  yield takeEvery(FETCH_AVATAR, fetchAvatar);
  yield takeLatest(FETCH_CURRENT_EMPLOYEE, fetchCurrentEmployee);
  yield takeLatest(REDIRECT_TO_SSO, redirectToSSO);
}

export default userSaga;
