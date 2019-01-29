// @flow
import * as R from "ramda";

import {
  UserActions,
} from "../actions";

const {
  FETCH_AVATAR_SUCCEEDED,
  FETCH_CURRENT_EMPLOYEE_SUCCEEDED,
} = UserActions;

const initialState = {
  avatars: {},
  currentUser: {},
  ssoUrl: "",
};

function user(state: Object = initialState, action: Object) {
  // This is to merge the reducers initial state with the type
  // that gets passed in from the Rails side javascript.
  if (R.prop("hydrated", state) === false) {
    if (R.has("hydrated", state)) {
      return R.mergeAll([initialState, state, {hydrated: true}]);
    }
  }

  switch (action.type) {
    case FETCH_AVATAR_SUCCEEDED: return updateAvatarMap(state, action);
    case FETCH_CURRENT_EMPLOYEE_SUCCEEDED: return updateCurrentUser(state, action);
    default: return state;
  }
}

function updateAvatarMap(state, {userId, payload}) {
  return R.mergeDeepRight(state, {avatars: {[userId]: payload}});
}

function updateCurrentUser(state, {payload}) {
  return R.mergeRight(state, {currentUser: payload});
}

export default user;
