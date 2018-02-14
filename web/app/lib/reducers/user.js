// @flow
import * as R from "ramda";

import {
  UserActions,
} from "../actions";

const {
  FETCH_AVATAR_SUCCEEDED,
} = UserActions;

const initialState = {
  avatars: {},
};

function user(state: Object = initialState, action : Object) {
  switch (action.type) {
  case "@@INIT": return R.merge(initialState, state);
  case FETCH_AVATAR_SUCCEEDED: return updateAvatarMap(state, action);
  default: return state;
  }
}

function updateAvatarMap(state, {userId, payload}) {
  return R.mergeDeepRight(state, {avatars: {[userId]: payload}});
}

export default user;
