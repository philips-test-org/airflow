// @flow
// General purpose actions.

const GeneralActions = {
  REQUEST_FAILED: "REQUEST_FAILED"
};

const requestFailed = (error: Object) => {
  return {
    type: GeneralActions.REQUEST_FAILED,
    error,
  }
}


export {
  GeneralActions,
  requestFailed,
}
