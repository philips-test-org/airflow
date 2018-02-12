// @flow
import {createStore, applyMiddleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";

import rootSaga from "./sagas";

import rootReducer from "./reducers/index";

const store = (initState = {}) => {
  const sagaMiddleware = createSagaMiddleware();

  let s = createStore(rootReducer, initState, composeWithDevTools(
    applyMiddleware(
      sagaMiddleware
    )
  ));

  sagaMiddleware.run(rootSaga);
  return s;
}

export default store;
