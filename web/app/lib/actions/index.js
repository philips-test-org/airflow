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
  adjustOrder,
  adjustOrderSucceeded,
  fetchExams,
  fetchExamsSucceeded,
  fetchKioskExams,
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
  adjustOrder,
  adjustOrderSucceeded,
  fetchExams,
  fetchExamsSucceeded,
  fetchKioskExams,
  showOrderModal,
  closeOrderModal,
  // USER
  UserActions,
  fetchAvatar,
  fetchAvatarSucceeded,
}
