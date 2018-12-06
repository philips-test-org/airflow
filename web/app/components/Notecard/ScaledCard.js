// @flow
import React, {PureComponent} from "react";
import * as R from "ramda";
import moment from "moment";

import {
  getOrderStartTime,
  maybeMsToSeconds,
  orderDuration,
  PIXELS_PER_SECOND,
} from "../../lib";

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
      const cardStyle = R.mergeRight({
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
      const seconds = maybeMsToSeconds(orderDuration(startDate, order)) || 0;
      // Default for bad data
      if (seconds < 0) {
        return 30;
      } else {
        // Check to see if the card is going to try to go further than 12pm
        // Take the difference between the end of the day and the order start for the seconds til midnight.
        const endDayDiff = moment.duration(moment(startDate).endOf("day").diff(moment(getOrderStartTime(order)))).as("seconds");
        const secondsCheck = R.min(
          seconds,
          endDayDiff,
        );
        return Math.round(secondsCheck * PIXELS_PER_SECOND);
      }
    }

    orderTop() {
      const startTime = moment(getOrderStartTime(this.props.order));
      const hoursToSeconds = startTime.hour() * 60 * 60;
      const minutesToSeconds = startTime.minute() * 60;
      const totalSeconds = R.sum([hoursToSeconds, minutesToSeconds, startTime.seconds()]);
      return Math.round(totalSeconds * PIXELS_PER_SECOND);
    }
  }
}

export default ScaledCard;
