/* global process, require */
import "raf/polyfill";
import "url-search-params-polyfill";

import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import * as R from "ramda";

import store from "./lib/store";
import {isIE} from "./lib";

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
if ($(target).length > 0) {
  const spinnerUrl = $(target).data("spinnerurl");
  const ssoUrl = $(target).data("ssourl");
  const view = $(".active .view-changer").data("viewType");
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
  if (!isIE() || isIE() > 9) {
    history.replaceState({viewType: props.board.type}, props.board.type, document.location.pathname);
  }
  render (
    <Provider store={store(R.mergeDeepLeft(props, {board: {hydrated: false}, user: {hydrated: false}}))}>
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
