// @flow

import React, {Component} from "react";
import * as R from "ramda";
import moment from "moment";

import {
  PIXELS_PER_SECOND,
} from "../../../lib/data";

type Props = {
  width: number,
};

class RightNow extends Component<Props> {
  componentDidMount() {
    this.scrollTo();
  }

  render() {
    const style = {
      top: this.getHeight(),
      display: "block",
      width: this.props.width,
    }
    return (
      <div id="right-now" style={style}></div>
    );
  }

  scrollTo() {
    const element = document.getElementById("right-now");
    if (element) {
      // These options are valid via MDN
      // (https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)
      // but Flow doesn't recognize them.
      // $FlowFixMe
      element.scrollIntoView({block: "center", behavior: "smooth"});
    }
  }

  getHeight() {
    const now = moment();
    const hoursToSeconds = now.hour() * 60 * 60;
    const minutesToSeconds = now.minute() * 60;
    const totalSeconds = R.sum([hoursToSeconds, minutesToSeconds, now.seconds()]);
    return Math.round(PIXELS_PER_SECOND * totalSeconds);
  }
}

export default RightNow;
