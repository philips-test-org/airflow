// @flow
import React, {PureComponent} from "react";
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

import {
  maybeMsToSeconds,
  orderDuration,
  wrapEvent,
} from "../../lib/data";

import CommentInterface from "./CommentInterface";
import RoundingInterface from "./RoundingInterface";
import StatusToggle from "./StatusToggle";
import ExamImageLink from "./ExamImageLink";

import type {
  Order,
  RadExam,
  User,
} from "../../types";

type Props = {
  adjustOrder: (event: Object) => void,
  avatarMap: {[number]: Blob},
  closeModal: () => void,
  currentUser: User,
  exams: Array<RadExam>,
  fetchAvatar: (userId: number) => void,
  order: Order,
  orderGroup: Array<Order>,
  resourceMap: {[string]: string},
  startDate: number,
}

type State = {
  showMoreImages: boolean,
}

class OrderModal extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {showMoreImages: false};
  }

  render() {
    const {order, avatarMap, currentUser} = this.props;
    const cardColor = cardStatuses(order, "color", "#ddd");
    const userAvatar = avatarMap[currentUser.id];
    const roundingValue = R.find(R.propEq("event_type", "rounding-update"), order.events);
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
              <h5>Kiosk Number: {kioskNumber(order.id)}</h5>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-xs-6">
                    <RoundingInterface handleSubmit={this.handleRoundingUpdate} rounding={roundingValue} />
                    {this.renderImages()}
                    <ul className="nav nav-tabs nav-bottom-margin" role="tablist">
                      {this.renderOrderNavTabs()}
                    </ul>
                    <div className="tab-content">
                      {this.renderOrderTabPanel()}
                    </div>
                  </div>
                  <CommentInterface
                    avatar={userAvatar}
                    events={order.events}
                    fetchAvatar={this.props.fetchAvatar}
                    handleNewComment={this.handleNewComment}
                    orderId={order.id}
                    resourceMap={this.props.resourceMap}
                    user={this.props.currentUser}
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
    // Flipping and partially applying so that the parameter name
    // is the unapplied argument.
    const checkStatus = R.flip(R.flip(R.propEq)(true))(adjusted);
    const toggles = [
      {label: "On Hold", name: "onhold", faClass: "fa-hand-paper-o", isActive: checkStatus("onhold")},
      {label: "Anesthesia", name: "anesthesia", faClass: "GA", isActive: checkStatus("anesthesia")},
      {label: "Consent", name: "consent", faClass: "fa-handshake-o", isActive: checkStatus("consent")},
      {label: "PPCA Arrival", name: "ppca_arrival", faClass: "fa-thumbs-o-up", isActive: checkStatus("ppca_arrival")},
      {label: "PPCA Ready", name: "ppca_ready", faClass: "fa-check-circle-o", isActive: checkStatus("ppca_ready")},
      {label: "Paperwork", name: "paperwork", faClass: "fa-file-text", isActive: checkStatus("paperwork")},
    ];
    return R.addIndex(R.map)((toggle, index) => (
      <StatusToggle
        key={`order-panel-${index}`}
        handleChange={this.handleStatusChange}
        {...toggle} />
    ), toggles);
  }

  renderOrderNavTabs() {
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
          {this.renderDemographicsTableRow("Current Duration", this.formatDuration(maybeMsToSeconds(orderDuration(this.props.startDate, order))))}
          {this.renderDemographicsTableRow("Begin Exam", formatTimestamp(order.rad_exam.rad_exam_time.begin_exam))}
          {this.renderDemographicsTableRow("End Exam", formatTimestamp(order.rad_exam.rad_exam_time.end_exam))}
          {this.renderDemographicsTableRow("Ordering Physician", order.rad_exam.rad_exam_personnel.ordering.name)}
        </tbody>
      </table>
    )
  }

  renderDemographicsTableRow(key: string, value: any) {
    return (
      <tr>
        <th>{key}</th>
        <td>{value}</td>
      </tr>
    )
  }

  renderImages() {
    const {exams} = this.props;

    let body = <p>No completed exam images available</p>;

    if (exams && exams.length > 0) {
      const exam = R.head(exams);
      const otherExams = exams.length === 1
        ? null : this.renderRemainingExamImages();

      body = (
        <div>
          <ExamImageLink
            key={exam.id}
            description={R.path(["procedure", "description"], exam)}
            time={R.path(["rad_exam_time", "end_exam"], exam)}
            imageViewer={exam.image_viewer}
            integrationJson={exam.integration_json}
          />
          {otherExams}
        </div>
      );
    }

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h5>Exam Images</h5>
        </div>
        <div className="panel-body">{body}</div>
      </div>
    );
  }

  renderRemainingExamImages() {
    const remainingExams = R.tail(this.props.exams).map(exam => (
      <ExamImageLink
        key={exam.id}
        description={R.path(["procedure", "description"], exam)}
        time={R.path(["rad_exam_time", "end_exam"], exam)}
        imageViewer={exam.image_viewer}
        integrationJson={exam.integration_json}
      />
    ));

    return (
      <div>
        {!this.state.showMoreImages && <a href="#" onClick={this.viewMoreImages}>View more</a>}
        {this.state.showMoreImages && remainingExams}
      </div>
    );
  }

  viewMoreImages = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.setState({showMoreImages: true});
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

  handleStatusChange = (eventType: string, newState: Object) => {
    const {order, currentUser} = this.props;
    this.props.adjustOrder(wrapEvent(order.id, currentUser.id, eventType, null, newState));
  }

  handleNewComment = (comment: string) => {
    const {order, currentUser} = this.props;
    this.props.adjustOrder(wrapEvent(order.id, currentUser.id, "comment", comment, {}));
  }

  handleRoundingUpdate = (comment: string) => {
    const {order, currentUser} = this.props;
    this.props.adjustOrder(wrapEvent(order.id, currentUser.id, "rounding-update", comment, {}));
  }

  closeModal = () => {
    this.props.closeModal();
  }
}

export default OrderModal;
