// @flow
import React, {Component} from "react";
import * as R from "ramda";
import moment from "moment";

import {
  examStartTime,
  maybeMsToSeconds,
  orderDuration,
} from "../../lib/data";

import {
  cardStatuses,
} from "../../lib/utility";

import {
  PIXELS_PER_SECOND,
} from "../../lib/constants";

import type {ComponentType} from "react";

import type {
  Order,
} from "../../types";

type Props = {
  order: Order,
  startDate: number,
  type: "calendar" | "kiosk",
}

function ScaledCard(WrappedComponent: ComponentType<any>) {
  return class ScaledCard extends Component<Props> {
    render() {
      const orderHeight = this.orderHeight();
      const cardStyle = {
        height: `${orderHeight}px`,
        maxHeight: `${orderHeight}px`,
        top: `${this.orderTop()}px`,
      };
      const cardClass = `notecard ${this.cardClass()}`
      const cardColor = this.cardColor();
      return (
        <WrappedComponent
          cardClass={cardClass}
          cardColor={cardColor}
          style={cardStyle}
          orderHeight={orderHeight}
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

    negativeDuration() {
      // TODO FIXME
      return false;
    }

    cardColor() {
      return cardStatuses(this.props.order, "color", "#ddd");
    }

    cardClass() {
      const {type} = this.props;
      const status = type === "kiosk" ? "" : cardStatuses(this.props.order, "card_class");
      return R.join(" ", [
        this.props.type === "overview" ? "overview" : "scaled",
        this.negativeDuration() ? "bad-duration" : "",
        status,
      ]);
    }
  }
}

export default ScaledCard;
