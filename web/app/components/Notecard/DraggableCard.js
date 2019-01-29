// @flow
/* eslint react/no-find-dom-node:0 */
import React, {Component} from "react";
import {findDOMNode} from "react-dom";
import * as R from "ramda";
import moment from "moment";
import {DragSource} from "react-dnd";

import BaseNotecard from "./BaseNotecard";

import {
  ItemTypes,
  PIXELS_PER_SECOND,
  getOrderStartTime,
  maybeMsToSeconds,
  orderDuration,
  orderStopTime,
} from "../../lib";

import type {
  Order,
} from "../../types";

type Props = {
  comments: Object,
  isFiltered: boolean,
  offsetStyle: Object,
  order: Order,
  openModal: (Order) => void,
  removeOrders: (orderIds: Array<number>) => void,
  startDate: number,
  type: "calendar" | "overview" | "kiosk",
  connectDragSource: Function,
  isDragging: boolean,
  updateOrderTime: (orderId: number, resourceId: number, newState: Object) => void,
}

// Drag and Drop setup
const notecardSource = {
  beginDrag(props, monitor, component){
    const element = document.getElementById("board");
    return {
      id: props.order.id,
      orderTop: component.orderTop(),
      orderHeight: component.orderHeight(),
      scrollTopStart: element ? element.scrollTop : 0,
    };
  },
  endDrag(props, monitor, component) {
    const result = monitor.getDropResult();
    if (!R.isNil(result)) {
      const {targetResourceId, movementDelta} = result;
      const changedLanes = targetResourceId !== props.resourceId;
      const changedTime = Math.abs(movementDelta.y) > 5; // 5 pixels is arbitrary.

      // Prevent firing off events if card moved and was dropped back in same place.
      if (changedLanes || changedTime) {
        const element = document.getElementById("board");

        const currentScrollTop = element ? element.scrollTop : 0;
        const newTop = R.max(0, component.orderTop() + movementDelta.y - (result.scrollTopStart - currentScrollTop));

        const newStart = component.orderHeightToStartTime(newTop);
        const newStop = component.orderHeightToStopTime(newTop);
        const newState = {
          start_time: newStart,
          stop_time: newStop,
          resource_id: targetResourceId,
        };
        props.updateOrderTime(props.order.id, newState);
      }
    }
  },
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

// React component
class DraggableCard extends Component<Props> {
  shouldComponentUpdate(nextProps) {
    return !R.equals(nextProps, this.props);
  }

  render() {
    const {connectDragSource, isDragging} = this.props;
    const cardStyle = R.mergeRight({
      height: `${this.orderHeight()}px`,
      maxHeight: `${this.orderHeight()}px`,
      top: `${this.orderTop()}px`,
      opacity: isDragging || this.props.isFiltered ? 0.4 : 1,
    }, this.props.offsetStyle);
    return (
      // TODO the current duration doesn't stick to the order when the modal opens
      <BaseNotecard
        ref={instance => connectDragSource(findDOMNode(instance))}
        style={cardStyle}
        {...this.props}
      />
    );
  }

  orderHeightToStartTime(height: number) {
    // * 1000 to get from seconds -> milliseconds
    return (this.props.startDate + (height / PIXELS_PER_SECOND * 1000));
  }

  orderHeightToStopTime(height: number) {
    const {order, startDate} = this.props;
    var duration = orderStopTime(startDate, order) - getOrderStartTime(this.props.order);
    return this.orderHeightToStartTime(height) + duration;
  }

  orderHeight() {
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
    const totalSeconds = moment.duration(
      moment(startTime).diff(moment(startTime).startOf("day"))
    ).as("seconds");
    return Math.round(totalSeconds * PIXELS_PER_SECOND);
  }
}

export default DragSource(ItemTypes.NOTECARD, notecardSource, collect)(DraggableCard);
