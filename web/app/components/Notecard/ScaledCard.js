// @flow
import React, {PureComponent} from "react";
import * as R from "ramda";
import moment from "moment";

import {
  examStartTime,
  maybeMsToSeconds,
  orderDuration,
} from "../../lib/data";

import {
  PIXELS_PER_SECOND,
} from "../../lib/constants";

import type {ComponentType} from "react";

import type {
  Order,
} from "../../types";

type Props = {
  offsetStyle: Object,
  order: Order,
  startDate: number,
  type: "calendar" | "kiosk",
}

function ScaledCard(WrappedComponent: ComponentType<any>) {
  return class ScaledCard extends PureComponent<Props> {
    render() {
      const orderHeight = this.orderHeight();
      const orderTop = this.orderTop();
      const cardStyle = R.merge({
        height: `${orderHeight}px`,
        maxHeight: `${orderHeight}px`,
        top: `${orderTop}px`,
      }, this.props.offsetStyle);
      return (
        <WrappedComponent
          style={cardStyle}
          orderHeight={orderHeight}
          orderTop={orderTop}
          {...this.props}
        />
      )
    }

    orderHeight(): number {
      const {order, startDate} = this.props;
      const durationSeconds = maybeMsToSeconds(orderDuration(startDate, order)) || 0;
      const seconds = Math.abs(durationSeconds);
      // Default for bad data
      if (seconds < 0) {
        return 30;
      } else {
        return Math.round(seconds * PIXELS_PER_SECOND);
      }
    }

    orderTop() {
      const startTime = moment(this.orderStartTime());
      const hoursToSeconds = startTime.hour() * 60 * 60;
      const minutesToSeconds = startTime.minute() * 60;
      const totalSeconds = R.sum([hoursToSeconds, minutesToSeconds, startTime.seconds()]);
      return Math.round(totalSeconds * PIXELS_PER_SECOND);
    }

    orderStartTime() {
      const {order} = this.props;
      const startTime =
        R.path(["adjusted", "start_time"], order) ? order.adjusted.start_time :
          order.rad_exam ? examStartTime(order.rad_exam) : order.appointment;
      if (!startTime) {return 0}
      return startTime;
    }
  }
}

export default ScaledCard;
