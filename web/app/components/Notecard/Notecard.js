// @flow
import React, {Component} from "react";
import * as R from "ramda";
import moment from "moment";

import {
  cardStatuses,
  checkExamThenOrder,
  formatName,
} from "../../lib/utility";

import {
  examStartTime,
  unadjustedOrderStartTime,
} from "../../lib/data";

import type {
  Order
} from "../../types";

type Props = {
  comments: Object,
  order: Order,
  openModal: (Order) => void,
  startDate: number,
  type: "calendar" | "overview" | "kiosk",
}

const PIXELS_PER_SECOND = 200.0 / 60.0 / 60.0;

class Notecard extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const {order, comments, type} = this.props;
    const cardClass = `notecard ${this.cardClass(order)}`
    const hasComments = !(R.isNil(comments)) && !(R.isEmpty(comments));
    const cardStyle = {
      height: this.orderHeight(),
      maxHeight: this.orderHeight(),
      top: this.orderTop(),
    };
    const cardId = `${type === "overview" ? "fixed" : "scaled"}-card-${order.id}`;
    return (
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
    var startTime;
    if (order.adjusted != undefined && order.adjusted.start_time) {
      startTime = order.adjusted.start_time;
    } else if (order.rad_exam) {
      startTime = examStartTime(order.rad_exam)
    } else {
      startTime = order.appointment;
    }
    return startTime < this.props.startDate ? this.props.startDate : startTime;
  }

  orderStopTime() {
    const {order} = this.props;
    if (!R.isNil(order.adjusted) && order.adjusted.start_time) {
      //adjusted start time plus the unadjusted duration
      return order.adjusted.start_time + this.orderDuration();
    } else if (!R.isNil(order.rad_exam) && order.rad_exam.rad_exam_time.end_exam) {
      return order.rad_exam.rad_exam_time.end_exam;
    } else if (typeof(order.appointment_duration) === "number") {
      return this.orderStartTime() + (order.appointment_duration * 1000);
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
      return unadjustedOrderStartTime(startDate, order) + (order.appointment_duration * 1000);
    } else if (!R.isNil(order.rad_exam)) {
      return unadjustedOrderStartTime(startDate, order) + (order.rad_exam.procedure.scheduled_duration * 60 * 1000);
    } else {
      return unadjustedOrderStartTime(startDate, order) + (order.procedure.scheduled_duration * 60 * 1000);
    }
  }

  orderDuration() {
    const {order, startDate} = this.props;
    return this.unadjustedOrderStopTime(order) - unadjustedOrderStartTime(startDate, order);
  }

  orderHeightToStartTime(height) {
    return this.props.startDate + (height / PIXELS_PER_SECOND * 1000);
  }

  orderHeightToStopTime(height) {
    const {order} = this.props;
    var duration = this.orderStopTime() - this.orderStartTime();
    return this.orderHeightToStartTime(height) + duration;
  }

  orderHeight() {
    const {order} = this.props;
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
    return Math.round(totalSeconds * PIXELS_PER_SECOND) + "px";
  }

  openModal = () => {
    this.props.openModal(R.merge(this.props.order, {
      currentDuration: (this.orderDuration() / 1000)
    }))
  }
}

export default Notecard;
