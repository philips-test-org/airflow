/* global process, require */
import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import * as R from "ramda";

import store from "./lib/store";

import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

import Airflow from "./components/Airflow";

if (process.env.NODE_ENV !== "production" && process.env.DEBUG === "true") {
  const {whyDidYouUpdate} = require("why-did-you-update");
  whyDidYouUpdate(React, {exclude: [
    /^Connect/,
    /^withStyles/,
    /^DragSource/,
    /^DragTarget/,
    /^DragDropContext/,
    /^DropTarget/,
    /^DayPickerSingleDateController/,
    /^CalendarMonth/,
  ]});
}


// Make sure the target element exists before attempting to render.
const target = "#workspace";
if ($(target)) {
  const spinnerUrl = $(target).data("spinnerUrl");
  const ssoUrl = $(target).data("ssoUrl");
  const view = $(".active .view-changer").data("view-type");
  const props = {
    board: {
      type: view,
      images: {spinner: spinnerUrl},
    },
    user: {
      ssoUrl,
    },
  };

  // Set the initial view in browser history
  history.replaceState({viewType: props.board.type}, props.board.type, document.location.pathname);
  render (
    <Provider key={props.key} store={store(R.mergeDeepLeft(props, {board: {hydrated: false}, user: {hydrated: false}}))}>
      <Airflow />
    </Provider>,
    document.querySelector(target)
  )
}

$(() => {
  // Sets up outside integration into the app
  // This allows non-React components to integrate
  // with React components via the Redux store to
  // minimize impure interactions.

  if (window) {
    window.dispatch = store.dispatch;
  }
});
