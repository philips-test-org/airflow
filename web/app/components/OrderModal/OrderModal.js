// @flow
import React, {Component} from "react";
import * as R from "ramda";
import moment from "moment";

import {
  appointmentTime,
  cardStatuses,
  checkExamThenOrder,
  formatName,
  formatTimestamp,
  kioskNumber,
  patientType,
} from "../../lib/utility";

import CommentInterface from "./CommentInterface";
import StatusToggle from "./StatusToggle";

import type {
  Order,
} from "../../types";

type User = {
  id: number,
  avatar: Object,
}

type Props = {
  closeModal: () => void,
  fetchAvatar: (userId: number) => void,
  order: Order,
  orderGroup: Array<Order>,
  user: User,
}

class OrderModal extends Component {
  static defaultProps = {
    user: {id: 21, avatar: null}
  }

  render() {
    const {order} = this.props;
    const cardColor = cardStatuses(order, "color", "#ddd");
    return (
      <div id="order-modal" className="modal fade in modal-open" tabIndex="-1" role="dialog" style={{display: "block"}}>
        <div className="modal-dialog modal-wide" role="document">
          <div className="modal-content">
            <div className="left-stripe" style={{backgroundColor: cardColor}}></div>
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.closeModal}><span aria-hidden="true">&times;</span></button>
              <div className="status-toggles">
                {this.renderStatusToggles()}
              </div>
              <h4 className="modal-title">{formatName(order.patient_mrn.patient.name)}</h4>
              <h5 clas="no-margin">Kiosk Number: {kioskNumber(order.id)}</h5>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-xs-6">
                    {this.renderRoundingInterface()}
                    <ul className="nav nav-tabs nav-bottom-margin" role="tablist">
                      {this.renderOrderNavTabs()}
                    </ul>
                    <div className="tab-content">
                      {this.renderOrderTabPanel()}
                    </div>
                  </div>
                  <CommentInterface
                    avatar={this.props.user.avatar}
                    events={order.events}
                    fetchAvatar={this.props.fetchAvatar}
                    orderId={order.id}
                    userId={this.props.user.id}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderStatusToggles() {
    const {order: {adjusted}} = this.props;
    const checkStatus = R.flip(R.has)(adjusted);
    const toggles = [
      {label: "On Hold", faClass: "fa-hand-paper-o", isActive: checkStatus("onhold")},
      {label: "Anesthesia", faClass: "GA", isActive: checkStatus("anesthesia")},
      {label: "Consent", faClass: "fa-handshake-o", isActive: checkStatus("consent")},
      {label: "PPCA Ready", faClass: "fa-thumbs-o-up", isActive: checkStatus("ppca_ready")},
      {label: "Paperwork", faClass: "fa-file-text", isActive: checkStatus("paperwork")},
    ];
    return R.addIndex(R.map)((toggle, index) => <StatusToggle key={`order-panel-${index}`} {...toggle} />, toggles);
  }

  renderRoundingInterface() {
    // TODO
    const roundingValue = {}
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <div className="row">
            <div className="col-xs-9" >
              <h5>Rounding</h5>
            </div>
            <div className="col-xs-3">
              <a href="#" className="btn btn-primary edit-rounding pull-right"><i className="fa fa-pencil"></i></a>
            </div>
          </div>
        </div>
        <div className="panel-body">
          <div className="rounding" style={{whiteSpace: "pre-line"}}>
            <p className="rounding-text">{roundingValue.text ? roundingValue.text : roundingValue.placeholder}</p>
          </div>

          <form id="rounding-form" className="hidden">
            <div className="body">
              <div className="content">
                <textarea
                  name="rounding"
                  className="form-control rounding-box"
                  rows="9"
                  disabled
                  autoFocus
                  placeholder={roundingValue.placeholder}
                  data-saved-value={roundingValue.text}>{roundingValue.text}</textarea>
                <input type="hidden" name="order_id" value={roundingValue.id} />
              </div>
              <div className="footer">
                <div className="pull-right">
                  <button className="btn btn-warning edit-rounding-cancel hidden">Cancel</button>
                  <button className="btn btn-default save-rounding">Save</button>
                </div>
                <div style={{clear: "both"}}></div>
              </div>
            </div>
          </form>
        </div>

        {this.renderEditedBy(roundingValue)}
      </div>
    )
  }

  renderEditedBy(roundingValue: Object) {
    if (!roundingValue.author) {return null};
    const {author, created_at} = roundingValue;
    return (
      <div className="panel-footer rounding-footer">
        <p className="edited-by">Last edited by: {author} on
          <span className="time short">{formatTimestamp(created_at)}</span>
        </p>
      </div>
    );
  }

  renderOrderNavTabs() {
    // TODO Fix classname/active status
    return (
      R.map((order) => (
        <li key={`${order.id}-nav-panel`} role="presentation" className={`${R.isNil(this.props.order.id) ? "" : "active"}`}>
          <a href={`#order-content-${order.id}`} aria-controls="home" role="tab" data-toggle="tab">{order.order_number}</a>
        </li>
      ), this.props.orderGroup)
    )
  }

  renderOrderTabPanel() {
    return (
      R.map((order) => (
        <div key={`${order.id}-panel`} role="tabpanel" className={`tab-panel${R.isNil(this.props.order.id) ? " active" : ""}`} id="order-content-{{id}}">
          {this.renderDemographics()}
        </div>
      ), this.props.orderGroup)
    )
  }

  renderDemographics() {
    const {order} = this.props;
    return (
      <table className="table table-bordered table-striped">
        <tbody>
          {this.renderDemographicsTableRow("Accession", order.rad_exam.accession)}
          {this.renderDemographicsTableRow("Order Number", order.order_number)}
          {this.renderDemographicsTableRow("Patient MRN", order.patient_mrn.mrn)}
          {this.renderDemographicsTableRow("Patient DOB", order.patient_mrn.patient.birthdate)}
          {this.renderDemographicsTableRow("Patient Location", this.patientLocation())}
          {this.renderDemographicsTableRow("Patient Type", patientType(order))}
          {this.renderDemographicsTableRow("Patient Class", this.siteClassName())}
          {this.renderDemographicsTableRow("Resource", this.resourceName())}
          {this.renderDemographicsTableRow("Procedure", checkExamThenOrder(order, ["procedure", "description"]))}
          {this.renderDemographicsTableRow("Default Procedure Duration", this.defaultProcedureDuration())}
          {this.renderDemographicsTableRow("Sign In", formatTimestamp(order.rad_exam.rad_exam_time.sign_in))}
          {this.renderDemographicsTableRow("Check In", formatTimestamp(order.rad_exam.rad_exam_time.check_in))}
          {this.renderDemographicsTableRow("Appointment", formatTimestamp(appointmentTime(this.props.order)))}
          {this.renderDemographicsTableRow("Appointment Duration", this.formatDuration(order.appointment_duration))}
          {this.renderDemographicsTableRow("Current Duration", this.formatDuration(order.currentDuration))}
          {this.renderDemographicsTableRow("Begin Exam", formatTimestamp(order.rad_exam.rad_exam_time.begin_exam))}
          {this.renderDemographicsTableRow("End Exam", formatTimestamp(order.rad_exam.rad_exam_time.end_exam))}
          {this.renderDemographicsTableRow("Ordering Physician", order.rad_exam.rad_exam_personnel.ordering.name)}
        </tbody>
      </table>
    )
  }

  renderDemographicsTableRow(key, value) {
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
    const siteClass = checkExamThenOrder(this.props.order, "site_class");
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

  formatDuration(duration: number) {
    if ((duration || duration === 0) && !isNaN(duration)) {
      const extra = duration <= 0;
      if (extra) {
        const parsedDuration = moment.duration(Math.abs(duration), "seconds");
        var outputString;

        if (extra) { var sign = "-"; } else { var sign = ""; }

        if (days > 0) {
          outputString = `${sign}${parsedDuration.get("days")}d, ${parsedDuration.get("hours")}h`;
        } else {
          outputString = `${sign}${parsedDuration.get("hours")}h, ${parsedDuration.get("minutes")}m`;
        }

        return <span className="alert-red">${outputString}</span>;
      }
      else {
        return null;
      }
    } else if (duration) {
      return duration;
    } else {
      return "---";
    }
  }

  closeModal = () => {
    this.props.closeModal();
  }
}

export default OrderModal;
