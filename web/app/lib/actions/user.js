// @flow
import type {
  User,
} from "../../types";

const UserActions = {
  FETCH_AVATAR: "FETCH_AVATAR",
  FETCH_AVATAR_SUCCEEDED: "FETCH_AVATAR_SUCCEEDED",
  FETCH_CURRENT_EMPLOYEE: "FETCH_CURRENT_EMPLOYEE",
  FETCH_CURRENT_EMPLOYEE_SUCCEEDED: "FETCH_CURRENT_EMPLOYEE_SUCCEEDED",
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

const fetchCurrentEmployee = () => {
  return {
    type: UserActions.FETCH_CURRENT_EMPLOYEE,
  }
}

const fetchCurrentEmployeeSucceeded = (payload: User) => {
  return {
    type: UserActions.FETCH_CURRENT_EMPLOYEE_SUCCEEDED,
    payload,
  }
}

export {
  UserActions,
  fetchAvatar,
  fetchAvatarSucceeded,
  fetchCurrentEmployee,
  fetchCurrentEmployeeSucceeded,
}
