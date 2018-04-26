// @flow
/* eslint react/no-find-dom-node:0 */
import React, {PureComponent} from "react";
import {findDOMNode} from "react-dom";
import * as R from "ramda";
import moment from "moment";
import {DragSource} from "react-dnd";

import BaseNotecard from "./BaseNotecard";

import {
  examStartTime,
  maybeMsToSeconds,
  orderDuration,
} from "../../lib/data";

import {
  ItemTypes,
  PIXELS_PER_SECOND,
} from "../../lib/constants";

import type {
  Order
} from "../../types";

type Props = {
  comments: Object,
  isFiltered: boolean,
  order: Order,
  openModal: (Order) => void,
  startDate: number,
  type: "calendar" | "overview" | "kiosk",
  connectDragSource: Function,
  isDragging: boolean,
  updateOrderTime: (orderId: number, resourceId: number, newState: Object) => void,
}

// Drag and Drop setup
const notecardSource = {
  beginDrag(props){
    return {id: props.order.id};
  },
  endDrag(props, monitor, component) {
    const result = monitor.getDropResult();
    if (!R.isNil(result)) {
      const {targetResourceId, movementDelta} = result;
      const changedLanes = targetResourceId !== props.resourceId;
      const changedTime = Math.abs(movementDelta.y) > 5; // 5 pixels is arbitrary.

      // Prevent firing off events if card moved and was dropped back in same place.
      if (changedLanes || changedTime) {
        const newTop = R.max(0, component.orderTop() + movementDelta.y);
        const newStart = component.orderHeightToStartTime(newTop);
        const newStop = component.orderHeightToStopTime(newTop);
        const newState = {
          start_time: newStart,
          stop_time: newStop,
          resource_id: targetResourceId
        }
        props.updateOrderTime(props.order.id, newState);
      }
    }
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

// React component
class DraggableCard extends PureComponent<Props> {
  render() {
    const {connectDragSource, isDragging} = this.props;
    const cardStyle = {
      height: this.orderHeight(),
      maxHeight: this.orderHeight(),
      top: `${this.orderTop()}px`,
      opacity: isDragging || this.props.isFiltered ? 0.4 : 1,
    };
    return (
      // TODO the current duration doesn't stick to the order when the modal opens
      <BaseNotecard
        ref={instance => connectDragSource(findDOMNode(instance))}
        style={cardStyle}
        {...this.props}
      />
    );
  }

  // Find the start time for an order
  orderStartTime() {
    const {order} = this.props;
    const startTime =
      R.path(["adjusted", "start_time"], order) ? order.adjusted.start_time :
        order.rad_exam ? examStartTime(order.rad_exam) : order.appointment;
    if (!startTime) {return 0}
    return startTime;
  }

  orderStopTime() {
    const {order, startDate} = this.props;
    const {adjusted} = order;
    if (!R.isNil(adjusted) && adjusted.start_time) {
      // adjusted start time plus the unadjusted duration
      return adjusted.start_time + orderDuration(startDate, order);
    } else if (!R.isNil(order.rad_exam) && order.rad_exam.rad_exam_time.end_exam) {
      return order.rad_exam.rad_exam_time.end_exam;
    } else if (typeof(order.appointment_duration) === "number") {
      let durationMS = order.appointment_duration ? order.appointment_duration * 1000 : 0;
      return this.orderStartTime() + durationMS;
    } else if (!R.isNil(order.rad_exam)) {
      return this.orderStartTime() + (order.rad_exam.procedure.scheduled_duration * 60 * 1000);
    } else {
      return this.orderStartTime() + (order.procedure.scheduled_duration * 60 * 1000);
    }
  }

  orderHeightToStartTime(height: number) {
    // * 1000 to get from seconds -> milliseconds
    return (this.props.startDate + (height / PIXELS_PER_SECOND * 1000));
  }

  orderHeightToStopTime(height: number) {
    var duration = this.orderStopTime() - this.orderStartTime();
    return this.orderHeightToStartTime(height) + duration;
  }

  orderHeight() {
    const {order, startDate} = this.props;
    const durationSeconds = maybeMsToSeconds(orderDuration(startDate, order)) || 0;
    const seconds = Math.abs(durationSeconds);
    // Default for bad data
    if (seconds < 0) {
      return "30px"
    } else {
      return Math.round(seconds * PIXELS_PER_SECOND) + "px";
    }
  }

  orderTop() {
    const startTime = moment(this.orderStartTime());
    const hoursToSeconds = startTime.hour() * 60 * 60;
    const minutesToSeconds = startTime.minute() * 60;
    const totalSeconds = R.sum([hoursToSeconds, minutesToSeconds, startTime.seconds()]);
    return Math.round(totalSeconds * PIXELS_PER_SECOND);
  }
}

export default DragSource(ItemTypes.NOTECARD, notecardSource, collect)(DraggableCard);
