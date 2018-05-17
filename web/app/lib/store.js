// @flow
import {createStore, applyMiddleware, compose} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import apmConnector from "./apm_middleware";

import rootSaga from "./sagas";

import rootReducer from "./reducers/index";

const store = (initState: Object = {}) => {
  const sagaMiddleware = createSagaMiddleware();

  const compFun = window && window.__REDUX_DEVTOOLS_EXTENSION__ ? composeWithDevTools : compose;
  let s = createStore(rootReducer, initState, compFun(
    applyMiddleware(
      apmConnector,
      sagaMiddleware
    )
  ));

  sagaMiddleware.run(rootSaga);
  return s;
}

export default store;
