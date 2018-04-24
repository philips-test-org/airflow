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
  showLoading,
  hideLoading,
  fetchInitialApp,
  fetchResourcesSucceeded,
  updateDate,
  updateViewType,
  updateBrowserHistory,
  updateSelectedResourceGroup,
} from "./board";

//USER
import {
  UserActions,
  fetchAvatar,
  fetchAvatarSucceeded,
  fetchCurrentEmployee,
  fetchCurrentEmployeeSucceeded,
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
  showLoading,
  hideLoading,
  fetchInitialApp,
  fetchResourcesSucceeded,
  updateDate,
  updateViewType,
  updateBrowserHistory,
  updateSelectedResourceGroup,
  // USER
  UserActions,
  fetchAvatar,
  fetchAvatarSucceeded,
  fetchCurrentEmployee,
  fetchCurrentEmployeeSucceeded,
}
