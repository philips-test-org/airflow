// @flow

const UserActions = {
  FETCH_AVATAR: "FETCH_AVATAR",
  FETCH_AVATAR_SUCCEEDED: "FETCH_AVATAR_SUCCEEDED",
}

// Action generator functions

const fetchAvatar = (userId: number) => {
  return {
    type: UserActions.FETCH_AVATAR,
    userId,
  }
}

const fetchAvatarSucceeded = (userId: number, payload: Object) => {
  return {
    type: UserActions.FETCH_AVATAR_SUCCEEDED,
    userId,
    payload,
  }
}

export {
  UserActions,
  fetchAvatar,
  fetchAvatarSucceeded,
}
