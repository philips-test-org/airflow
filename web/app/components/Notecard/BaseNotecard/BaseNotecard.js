// @flow
import React, {PureComponent} from "react";
import * as R from "ramda";

import {
  cardStatuses,
  checkExamThenOrder,
  formatName,
} from "../../../lib/utility";

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

class BaseNotecard extends PureComponent<Props> {
  render() {
    const {order, comments} = this.props;
    const cardClass = `notecard ${this.cardClass()}`
    const hasComments = !(R.isNil(comments)) && !(R.isEmpty(comments));
    const cardId = `${this.props.type === "overview" ? "fixed" : "scaled"}-card-${order.id}`;
    return (
      <div className={cardClass} id={cardId} style={this.props.style} onClick={this.openModal}>
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

  cardColor() {
    return cardStatuses(this.props.order, "color", "#ddd");
  }

  negativeDuration() {
    // TODO FIXME
    return false;
  }

  cardClass() {
    return R.join(" ", [
      this.props.type === "calendar" ? "scaled" : "overview",
      this.negativeDuration() ? "bad-duration" : "",
      cardStatuses(this.props.order, "card_class"),
    ]);
  }

}

export default BaseNotecard;
