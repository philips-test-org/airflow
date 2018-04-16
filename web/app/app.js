import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import * as R from "ramda";
import moment from "moment";
import store from "./lib/store";

import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

import Airflow from "./components/Airflow";

const initialState = {
  board: {
    orders: [],
    orderGroups: {},
    resources: {},
    selectedResourceGroup: "All",
    selectedResources: [],
    startDate: computeStartDate(),
    type: "calendar",
  },
  user: {
    avatars: {},
  }
};

const renderApp = (Component, target, props = {key: "nilState"}) => {
  // Make sure the target element exists before attempting to render.
  if ($(target)) {
    const initState = store(R.mergeDeepRight(initialState, R.omit(["key"], props)));
    render (
      <Provider key={props.key} store={initState}>
        <Component />
      </Provider>,
      document.querySelector(target)
    )
  }
}

function computeStartDate(selectedDate = moment().unix()) {
  return moment(selectedDate * 1000).startOf("day").unix()*1000;
}

$(() => {
  // Sets up outside integration into the app
  // This allows non-React components to integrate
  // with React components via the Redux store to
  // minimize impure interactions.

  if (window) {
    window.dispatch = store.dispatch;
    window.renderReact = renderApp;
    window.airflow = Airflow;
  }
});
