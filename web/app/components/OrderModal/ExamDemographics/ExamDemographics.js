// @flow
import React, {Component} from "react";
import * as R from "ramda";
import moment from "moment";

import {
  checkExamThenOrder,
  formatTimestamp,
  getAppointmentTime,
  getOrderingPhysician,
  getPatientType,
  getProcedure,
  maybeMsToSeconds,
  orderDuration,
} from "../../../lib";

import type {
  Order,
} from "../../../types";

type Props = {
  order: Order,
  orderGroup: Array<Order>,
  startDate: number,
}

type State = {
  selectedOrder: number,
}

class ExamDemographics extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedOrder: props.order.id,
    };
  }

  shouldComponentUpdate(newProps: Props, newState: State) {
    return !R.equals(this.props, newProps) || !R.equals(this.state, newState);
  }

  render() {
    const order = R.find(R.propEq("id", this.state.selectedOrder), this.props.orderGroup);
    return (
      <div id="exam-demographics">
        {this.renderOrderNavTabs()}
        <table className="table table-bordered table-striped">
          <tbody>
            {this.renderDemographicsTableRow("Accession", R.path(["rad_exam", "accession"], order))}
            {this.renderDemographicsTableRow("Order Number", order.order_number)}
            {this.renderDemographicsTableRow("Patient MRN", R.path(["patient_mrn", "mrn"], order))}
            {this.renderDemographicsTableRow("Patient DOB", R.path(["patient_mrn", "patient", "birthdate"], order))}
            {this.renderDemographicsTableRow("Patient Location", this.patientLocation())}
            {this.renderDemographicsTableRow("Patient Type", getPatientType(order))}
            {this.renderDemographicsTableRow("Patient Class", this.siteClassName())}
            {this.renderDemographicsTableRow("Resource", this.resourceName())}
            {this.renderDemographicsTableRow("Procedure", getProcedure(order))}
            {this.renderDemographicsTableRow("Default Procedure Duration", this.defaultProcedureDuration())}
            {this.renderDemographicsTableRow("Sign In", formatTimestamp(R.path(["rad_exam", "rad_exam_time", "sign_in"], order)))}
            {this.renderDemographicsTableRow("Check In", formatTimestamp(R.path(["rad_exam", "rad_exam_time", "check_in"], order)))}
            {this.renderDemographicsTableRow("Appointment", formatTimestamp(getAppointmentTime(order)))}
            {this.renderDemographicsTableRow("Appointment Duration", this.formatDuration(order.appointment_duration))}
            {this.renderDemographicsTableRow("Current Duration", this.formatDuration(maybeMsToSeconds(orderDuration(this.props.startDate, order))))}
            {this.renderDemographicsTableRow("Begin Exam", formatTimestamp(R.path(["rad_exam", "rad_exam_time", "begin_exam"], order)))}
            {this.renderDemographicsTableRow("End Exam", formatTimestamp(R.path(["rad_exam", "rad_exam_time", "end_exam"], order)))}
            {this.renderDemographicsTableRow("Ordering Physician", getOrderingPhysician(order))}
          </tbody>
        </table>
      </div>
    )
  }

  renderOrderNavTabs() {
    const {selectedOrder} = this.state;
    const tabs = R.map((order) => {
      const className = `order-nav ${R.equals(order.id, selectedOrder) ? "active" : ""}`;
      return (
        <li
          key={`${order.id}-nav-panel`}
          role="presentation"
          className={className}
          id={`nav-${order.id}`}
          onClick={() => {this.handleOrderNavClick(order.id)}}
        >
          <a href="#"
            aria-controls="home"
            role="tab"
          >{order.order_number}</a>
        </li>
      );
    }, this.props.orderGroup)

    return (
      <ul className="order-tabs nav nav-tabs nav-bottom-margin" role="tablist">
        {tabs}
      </ul>
    );
  }

  handleOrderNavClick(id: number) {
    this.setState({selectedOrder: id});
  }

  renderDemographicsTableRow(key: string, value: any) {
    return (
      <tr>
        <th>{key}</th>
        <td>{value}</td>
      </tr>
    )
  }

  patientLocation() {
    const {order} = this.props;
    const basePath = ["rad_exam", "site_sublocation", "site_location"]
    if (R.path(basePath, order)) {
      const name = R.pathOr(
        R.path(R.append("location", basePath), order),
        R.append("name", basePath),
        order
      );
      const room = order.rad_exam.site_sublocation.room;
      const bed = order.rad_exam.site_sublocation.bed;
      return `${name}, Room: ${room}, Bed: ${bed}`;
    }
    return null;
  }

  siteClassName() {
    const siteClass = checkExamThenOrder(this.props.order, ["site_class"]);
    if (siteClass == undefined) {
      return "";
    } else if (siteClass.name != "" && siteClass.name != undefined) {
      return siteClass.name;
    } else {
      return siteClass.site_class;
    }
  }

  resourceName() {
    const {order} = this.props;
    return checkExamThenOrder(order, ["resource", "name"]) ||
           checkExamThenOrder(order, ["resource", "resource"]);
  }

  defaultProcedureDuration() {
    const {order} = this.props;
    var duration = 60 * checkExamThenOrder(order, ["procedure", "scheduled_duration"]);
    return this.formatDuration(duration);
  }

  formatDuration(duration: ?number) {
    if ((duration || duration === 0) && !isNaN(duration)) {
      const sign = duration <= 0 ? "-" : "";
      const spanClass = duration <= 0 ? "alert-red" : "";
      const parsedDuration = moment.duration(Math.abs(duration), "seconds");
      const days = parsedDuration.get("days");
      const hours = parsedDuration.get("hours");
      const minutes = parsedDuration.get("minutes");

      var outputString;
      if (days > 0) {
        outputString = `${days}d, ${hours}h`;
      } else {
        outputString = `${hours}h, ${minutes}m`;
      }

      return <span className={spanClass}>{`${sign}${outputString}`}</span>;
    } else if (duration) {
      return duration;
    } else {
      return "---";
    }
  }

}

export default ExamDemographics;
