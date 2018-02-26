// @flow
import React, {PureComponent} from "react";
import * as R from "ramda";
import moment from "moment";
import {DragSource} from "react-dnd";

import {
  cardStatuses,
  checkExamThenOrder,
  formatName,
} from "../../lib/utility";

import {
  examStartTime,
  unadjustedOrderStartTime,
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
class Notecard extends PureComponent<Props> {
  render() {
    const {order, comments, type, connectDragSource, isDragging} = this.props;
    const cardClass = `notecard ${this.cardClass()}`
    const hasComments = !(R.isNil(comments)) && !(R.isEmpty(comments));
    const cardStyle = {
      height: this.orderHeight(),
      maxHeight: this.orderHeight(),
      top: `${this.orderTop()}px`,
      opacity: isDragging ? 0.5 : 1,
    };
    const cardId = `${type === "overview" ? "fixed" : "scaled"}-card-${order.id}`;
    return connectDragSource(
      <div className={cardClass} id={cardId} style={cardStyle} onClick={this.openModal}>
        <div className="left-tab" style={{backgroundColor: this.cardColor()}} />

        <div className="right-tab">
          <div className="events">{hasComments ? <i className="fa fa-paperclip"></i> : null}</div>

          {this.renderHeader()}

          <div className="body">
            <div className="procedure">{checkExamThenOrder(this.props.order, ["procedure", "description"])}</div>
            <div className="patient-location">{this.examLocation()}</div>
          </div>

          {this.renderFooter()}
        </div>
        <div className="hide data" data-order-id="{order.id}"></div>
      </div>
    );
  }

  renderHeader() {
    const patientPath = ["site_class", "patient_type", "patient_type"];
    const patientName = formatName(this.props.order.patient_mrn.patient.name);
    return (
      <div className="heading">
        <div className="patient-name">{patientName}</div>
        <div className="patient-type">{checkExamThenOrder(this.props.order, patientPath)}</div>
        <div className="mrn">{this.props.order.patient_mrn.mrn}</div>
      </div>
    );
  }

  renderFooter() {
    const {order: {adjusted}} = this.props;
    return (
      <div className="footer">
        <div className="left">
          {adjusted.anesthesia ? <div className="status-indicator anesthesia"><strong>GA</strong></div> : null}
        </div>
        <div className="right">
          {adjusted.consent ? <div className="status-indicator consent"><i className="fa fa-handshake-o"></i></div> : null}
          {adjusted.ppca_ready ? <div className="status-indicator ppca_ready"><i className="fa fa-thumbs-o-up"></i></div> : null}
          {adjusted.paperwork ? <div className="status-indicator paperwork"><i className="fa fa-file-text"></i></div> : null}
        </div>
      </div>
    )
  }

  examLocation() {
    const {order} = this.props;
    return R.pathOr(null, ["rad_exam", "site_sublocation", "site_location", "location"], order);
  }

  negativeDuration() {
    // TODO FIXME
    return false;
  }

  cardColor() {
    return cardStatuses(this.props.order, "color", "#ddd");
  }

  cardClass() {
    return R.join(" ", [
      this.props.type === "calendar" ? "scaled" : "overview",
      this.negativeDuration() ? "bad-duration" : "",
      cardStatuses(this.props.order, "card_class"),
    ]);
  }

  // Find the start time for an order
  orderStartTime() {
    const {order} = this.props;
    const startTime =
      R.path(["adjusted", "start_time"], order) ? order.adjusted.start_time :
        order.rad_exam ? examStartTime(order.rad_exam) : order.appointment;
    if (!startTime) {return 0}
    return startTime && startTime < this.props.startDate ? this.props.startDate : startTime;
  }

  orderStopTime() {
    const {order} = this.props;
    const {adjusted} = order;
    if (!R.isNil(adjusted) && adjusted.start_time) {
      //adjusted start time plus the unadjusted duration
      return adjusted.start_time + this.orderDuration();
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

  unadjustedOrderStopTime() {
    const {order, startDate} = this.props;
    if (!R.isNil(order.rad_exam) && order.rad_exam.rad_exam_time.end_exam) {
      return order.rad_exam.rad_exam_time.end_exam;
    } else if (typeof(order.appointment_duration) === "number") {
      let durationMS = order.appointment_duration ? order.appointment_duration * 1000 : 0;
      return unadjustedOrderStartTime(startDate, order) + durationMS;
    } else if (!R.isNil(order.rad_exam)) {
      return unadjustedOrderStartTime(startDate, order) + (order.rad_exam.procedure.scheduled_duration * 60 * 1000);
    } else {
      return unadjustedOrderStartTime(startDate, order) + (order.procedure.scheduled_duration * 60 * 1000);
    }
  }

  orderDuration() {
    const {order, startDate} = this.props;
    const unadjustedStartTime = unadjustedOrderStartTime(startDate, order) || 0;
    return this.unadjustedOrderStopTime() - unadjustedStartTime;
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
    const seconds = (this.orderDuration() / 1000);
    // Default for bad data
    if (seconds < 0) {
      return "30px;"
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

  openModal = () => {
    this.props.openModal(R.merge(this.props.order, {
      currentDuration: (this.orderDuration() / 1000)
    }))
  }
}

export default DragSource(ItemTypes.NOTECARD, notecardSource, collect)(Notecard);
