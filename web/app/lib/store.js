// @flow
import {createStore, applyMiddleware} from "redux";
import {devToolsEnhancer} from "redux-devtools-extension";

import rootReducer from "./reducers/index";

const store = createStore(rootReducer, {}, devToolsEnhancer());

export default store;
