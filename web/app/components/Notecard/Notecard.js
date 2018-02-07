// @flow
import React, {Component} from 'react';
import * as R from "ramda";

import type {
  Order
} from "../../types";

type props = {
  order: Order,
  comments: Object,
}

class Notecard extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    // TODO Fix setting styles inside of components
    const {order, comments} = this.props;
    const cardClass = `notecard overview ${this.cardClass(order)} ${this.negativeDuration() ? "bad-duration" : ""}`
    return (
      <div className={cardClass} id={`fixed-card-${order.id}`}>
        <div className="left-tab" style={{backgroundColor: this.cardColor()}} />

        <div className="right-tab">
          <div className="events">{comments ? <i className="fa fa-paperclip"></i> : null}</div>

          {this.renderHeader()}

          <div className="body">
            <div className="procedure">{this.checkExamThenOrder(R.lensPath(["procedure", "description"]))}</div>
            <div className="patient-location">{this.examLocation()}</div>
          </div>

          {this.renderFooter()}
        </div>
        <div className="hide data" data-order-id="{order.id}"></div>
      </div>
    );
  }

  renderHeader() {
    const patientTypeLens = R.lensPath(["site_class", "patient_type", "patient_type"]);
    return (
      <div className="heading">
        <div className="patient-name">{this.props.order.patient_mrn.patient.name}</div>
        <div className="patient-type">{this.checkExamThenOrder(patientTypeLens)}</div>
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
          {adjusted.consent ? <div className="status-indicator consent"><i class="fa fa-handshake-o"></i></div> : null}
          {adjusted.ppca_ready ? <div className="status-indicator ppca_ready"><i class="fa fa-thumbs-o-up"></i></div> : null}
          {adjusted.paperwork ? <div className="status-indicator paperwork"><i class="fa fa-file-text"></i></div> : null}
        </div>
      </div>
    )
  }

  examLocation() {
    const {order} = this.props;
    return R.defaultTo(null,
      R.view(R.lensPath(["rad_exam", "site_sublocation", "site_location", "location"], order))
    );
  }

  checkExamThenOrder(lens) {
    return R.defaultTo(
      R.view(lens, this.props.order),
      R.view(lens, this.props.order.rad_exam)
    );
  }

  negativeDuration() {
    // TODO FIXME
    return false;
  }

  cardColor() {
    return this.cardStatuses("color", "#ddd");
  }

  cardClass() {
    return this.cardStatuses("card_class");
  }

  cardStatuses(type, default_value: string = "") {
    const order = this.props.order;
    const checks = [
      {
        name: "On Hold",
        order: 5,
        color: "#f5f52b",
        card_class: "highlight",
        check: (order) => (order.adjusted.onhold == true)
      },
      {
        name: "Cancelled",
        order: 6,
        color: "#c8040e",
        check: (order) => {
          let orderCancelled = order.current_status.universal_event_type == "cancelled";
          let undefinedExam = order.rad_exam != undefined;
          let examCancelled = order.rad_exam.current_status.universal_event_type.event_type == "cancelled";
          return (orderCancelled || (undefinedExam && examCancelled));
        }
      },
      {
        name: "Started",
        order: 3,
        color: "#631d76",
        check: (order) => {
          let hasExam = order.rad_exam != undefined;
          let hasBeginTime = order.rad_exam.rad_exam_time.begin_exam;
          let noEndTime = order.rad_exam.rad_exam_time.end_exam == null;
          return (hasExam && hasBeginTime && noEndTime);
        }
      },
      {
        name: "Completed",
        order: 4,
        color: "#005a8b",
        card_class: "completed",
        check: (order) => {
          let hasExam = order.rad_exam != undefined;
          let hasEndTime = order.rad_exam.rad_exam_time.end_exam == null;
          return hasExam && hasEndTime;
        }
      },
      {
        name: "Patient Arrived",
        order: 2,
        color: "#1e9d8b",
        check: (order) => {
          let hasExam = order.rad_exam != undefined;
          let hasSignInTime = order.rad_exam.rad_exam_time.sign_in !== null;
          let hasCheckInTime = order.rad_exam.rad_exam_time.check_in !== null;
          return (hasExam && (hasSignInTime || hasCheckInTime));
        }
      },
      {
        name: "Ordered",
        order: 1,
        color: "#888888",
        check: (order) => {
          let noExam = order.rad_exam == undefined;
          let noSignInTime = R.isNil(order.rad_exam.rad_exam_time.sign_in);
          let noCheckInTime = R.isNil(order.rad_exam.rad_exam_time.check_in);
          return (noExam || noSignInTime || noCheckInTime);
        }
      }
    ]

    for (var i in application.statuses.checks) {
      if (application.statuses.checks[i].check(order)) {
        if (application.statuses.checks[i][type] != undefined) {
          return application.statuses.checks[i][type];
        }
      }
    }
    return default_value;
  }
}

export default Notecard;
