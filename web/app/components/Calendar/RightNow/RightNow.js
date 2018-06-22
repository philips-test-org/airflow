// @flow

import React, {PureComponent} from "react";
import moment from "moment";

import {
  HOURBAR_WIDTH,
  PIXELS_PER_SECOND,
} from "../../../lib/constants";

type Props = {
  width: number,
};

type State = {
  time: Object, // moment
}

// Update every 10 seconds
const UPDATE_INTERVAL = 10000;

class RightNow extends PureComponent<Props, State> {
  interval: IntervalID;

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
      width: this.displayWidth(),
    }
    return (
      <div id="right-now" style={style}></div>
    );
  }

  scrollTo() {
    const element = document.getElementById("right-now");
    if (element) {
      // Offset the scroll so that the bar is roughly in the
      // middle of the viewport.
      const offset = window.innerHeight / 2.2;
      // With the calendar refactor to be inside the Airflow component,
      // There are two levels of parent divs that have to be traversed
      // to get to the board that we want to scroll.
      const parent = element.parentNode;
      // $FlowFixMe
      if (parent) {
        const parentsParent = parent.parentNode;
        if (parentsParent) {
          // $FlowFixMe
          parentsParent.scrollTop = this.getHeight() - offset
        }
      }
    }
  }

  getHeight() {
    const now = this.state.time;
    const totalSeconds = moment.duration(
      moment(now).diff(moment(now).startOf("day"))
    ).as("seconds");
    return Math.round((PIXELS_PER_SECOND * totalSeconds));
  }

  displayWidth() {
    const timeGridWidth = this.props.width;
    return timeGridWidth - HOURBAR_WIDTH;
  }
}

export default RightNow;
