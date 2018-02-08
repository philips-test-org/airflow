// @flow
import {createStore, applyMiddleware} from "redux";
import {devToolsEnhancer} from "redux-devtools-extension";

import rootReducer from "./reducers/index";

const store = (initState = {}) => createStore(rootReducer, initState, devToolsEnhancer());

export default store;
