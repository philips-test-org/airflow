// @flow
// General purpose actions.

import type {ViewType} from "../../types";

const GeneralActions = {
  CONNECT_APM: "CONNECT_APM",
  REDIRECT_TO_SSO: "REDIRECT_TO_SSO",
  REQUEST_FAILED: "REQUEST_FAILED",
};

const connectAPM = () => {
  return {
    type: GeneralActions.CONNECT_APM,
  }
}

const redirectToSSO = (ssoUrl: string, viewType: ViewType) => {
  return {
    type: GeneralActions.REDIRECT_TO_SSO,
    ssoUrl,
    viewType,
  }
}

const requestFailed = (error: Object) => {
  return {
    type: GeneralActions.REQUEST_FAILED,
    error,
  }
}

export {
  GeneralActions,
  connectAPM,
  redirectToSSO,
  requestFailed,
}
