// @flow
import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import store from "./lib/store";

import Notecard from "./components/Notecard";
import Calendar from "./components/Calendar";

const renderApp = (Component, target, props = {}) => {
  // Make sure the target element exists before attempting to render.
  if ($(target)) {
    render (
      <Provider store={store(props)}>
        <Component />
      </Provider>,
      document.querySelector(target)
    )
  }
}

$(() => {
  // Sets up outside integration into the app
  // This allows non-React components to integrate
  // with React components via the Redux store to
  // minimize impure interactions.

  if (window) {
    window.dispatch = store.dispatch;
    window.renderReact = renderApp;
    window.notecard = Notecard;
    window.calendar = Calendar;
  }

  // Render components conditionally
  // Right now these are hard-coded, but we could
  // theoretically expose this into the window
  // object too to allow us to render/mount components
  // from inside of our Rails templates.
  //renderApp(HelloWorld, '#view-controls');
});
