// @flow

// Action imports

// GENERAL
import {
  GeneralActions,
  requestFailed,
} from "./general";

// BOARD
import {
  BoardActions,
  fetchExams,
  fetchExamsSucceeded,
  showOrderModal,
  closeOrderModal,
} from "./board";

//USER
import {
  UserActions,
  fetchAvatar,
  fetchAvatarSucceeded,
} from "./user";


// All exports
export {
  // GENERAL
  GeneralActions,
  requestFailed,
  // BOARD
  BoardActions,
  fetchExams,
  fetchExamsSucceeded,
  showOrderModal,
  closeOrderModal,
  // USER
  UserActions,
  fetchAvatar,
  fetchAvatarSucceeded,
}
