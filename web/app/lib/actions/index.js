// @flow

// Action imports

// GENERAL
import {
  GeneralActions,
  connectAPM,
  redirectToSSO,
  requestFailed,
} from "./general";

// BOARD
import {
  BoardActions,
  adjustOrder,
  adjustOrderSucceeded,
  fetchExams,
  fetchExamsSucceeded,
  fetchExam,
  fetchExamSucceeded,
  fetchKioskExams,
  fetchPersonExams,
  fetchPersonExamsSucceeded,
  showOrderModal,
  closeOrderModal,
  showLoading,
  hideLoading,
  fetchInitialApp,
  fetchResourcesSucceeded,
  replaceOrder,
  updateDate,
  updateViewType,
  updateWidth,
  updateBrowserHistory,
  updateSelectedResourceGroup,
  dispatchNotification,
  markNotificationDisplayed,
  updateWidthMultiplier,
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
  connectAPM,
  redirectToSSO,
  requestFailed,
  // BOARD
  BoardActions,
  adjustOrder,
  adjustOrderSucceeded,
  fetchExams,
  fetchExamsSucceeded,
  fetchExam,
  fetchExamSucceeded,
  fetchKioskExams,
  fetchPersonExams,
  fetchPersonExamsSucceeded,
  showOrderModal,
  closeOrderModal,
  showLoading,
  hideLoading,
  fetchInitialApp,
  fetchResourcesSucceeded,
  replaceOrder,
  updateDate,
  updateViewType,
  updateWidth,
  updateBrowserHistory,
  updateSelectedResourceGroup,
  dispatchNotification,
  markNotificationDisplayed,
  updateWidthMultiplier,
  // USER
  UserActions,
  fetchAvatar,
  fetchAvatarSucceeded,
  fetchCurrentEmployee,
  fetchCurrentEmployeeSucceeded,
}
