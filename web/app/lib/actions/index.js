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
  preAdjustOrder,
  addEvent,
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

// BUFFER
import {
  BufferActions,
  bufferEnqueue,
  flushBuffer,
  bufferMessage,
  resetBuffer,
} from "./buffer";

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
  preAdjustOrder,
  addEvent,
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
  replaceOrder,
  updateDate,
  updateViewType,
  updateWidth,
  updateBrowserHistory,
  updateSelectedResourceGroup,
  dispatchNotification,
  markNotificationDisplayed,
  updateWidthMultiplier,
  // BUFFER
  BufferActions,
  bufferEnqueue,
  flushBuffer,
  bufferMessage,
  resetBuffer,
  // USER
  UserActions,
  fetchAvatar,
  fetchAvatarSucceeded,
  fetchCurrentEmployee,
  fetchCurrentEmployeeSucceeded,
}
