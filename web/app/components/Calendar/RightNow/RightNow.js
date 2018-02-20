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

type State = {
  time: Object, // moment
}

const UPDATE_INTERVAL = 1000;

class RightNow extends Component<Props, State> {
  interval: number;

  constructor(props: Props) {
    super(props);


    this.state = {
      time: moment(),
    }
  }

  componentDidMount() {
    this.scrollTo();
    this.interval = setInterval(this.updateTime, UPDATE_INTERVAL);
  }

  updateTime = () => {
    this.setState({time: moment()});
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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
    const now = this.state.time;
    const hoursToSeconds = now.hour() * 60 * 60;
    const minutesToSeconds = now.minute() * 60;
    const totalSeconds = R.sum([hoursToSeconds, minutesToSeconds, now.seconds()]);
    return Math.round(PIXELS_PER_SECOND * totalSeconds);
  }
}

export default RightNow;
