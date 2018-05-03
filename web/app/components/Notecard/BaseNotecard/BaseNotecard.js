// @flow
import React, {PureComponent} from "react";
import * as R from "ramda";

import {
  cardStatuses,
  checkExamThenOrder,
  formatName,
} from "../../../lib/utility";

import type {
  Order,
} from "../../../types";

type Props = {
  comments: Object,
  isFiltered: boolean,
  isFocused: boolean,
  openModal: (Order) => void,
  order: Order,
  scrollToY: (y: number) => void,
  startDate: number,
  style: Object,
  type: "calendar" | "overview" | "kiosk",
  updateOrderTime: (orderId: number, resourceId: number, newState: Object) => void,
}

class BaseNotecard extends PureComponent<Props> {
  card: ?HTMLElement;

  componentDidUpdate(prevProps: Props) {
    if (this.card && this.props.isFocused !== prevProps.isFocused && this.props.isFocused) {
      this.props.scrollToY(this.card.offsetTop);
    }
  }

  render() {
    const {order, comments, style} = this.props;
    const hasComments = !(R.isNil(comments)) && !(R.isEmpty(comments));
    const cardId = `${this.props.type === "overview" ? "fixed" : "scaled"}-card-${order.id}`;
    const cardClass = `notecard ${this.cardClass()}`
    const cardColor = this.cardColor();
    const orderingPhysician = R.defaultTo(
      "unknown",
      R.path(["rad_exam", "rad_exam_personnel", "ordering", "name"], this.props.order),
    );
    return (
      <div
        className={cardClass}
        id={cardId}
        style={style}
        onClick={this.openModal}
        ref={el => this.card = el}
      >
        <div className="left-tab" style={{backgroundColor: cardColor}} />

        <div className="right-tab">
          <div className="events">{hasComments ? <i className="fa fa-paperclip"></i> : null}</div>

          {this.renderHeader()}

          <div className="body">
            <div className="procedure">{checkExamThenOrder(this.props.order, ["procedure", "description"])}</div>
            <div className="patient-location">{this.examLocation()}</div>
            <div className="ordering-physician">Ordered by: {orderingPhysician}</div>
          </div>

          {this.renderFooter()}
        </div>
        <div className="hide data" data-order-id="{order.id}"></div>
      </div>
    );
  }

  renderHeader() {
    const patientPath = ["site_class", "patient_type", "patient_type"];
    const patientName = R.path(["patient_mrn", "patient", "name"], this.props.order);
    if (!patientName) {return null}
    const formattedName = formatName(patientName);
    return (
      <div className="heading">
        <div className="patient-name">{formattedName}</div>
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
          {adjusted.anesthesia ? <div className="status-indicator anesthesia"><strong>A</strong></div> : null}
        </div>
        <div className="right">
          {adjusted.consent ? <div className="status-indicator consent"><i className="fa fa-handshake-o"></i></div> : null}
          {adjusted.ppca_ready ? <div className="status-indicator ppca_ready"><i className="fa fa-thumbs-o-up"></i></div> : null}
          {adjusted.paperwork ? <div className="status-indicator paperwork"><i className="fa fa-file-text"></i></div> : null}
        </div>
      </div>
    )
  }

  cardClass() {
    const {type} = this.props;
    const status = type === "kiosk" ? "" : cardStatuses(this.props.order, "card_class");
    return R.join(" ", [
      this.props.type === "overview" ? "overview" : "scaled",
      this.negativeDuration() ? "bad-duration" : "",
      this.props.isFiltered ? "filtered" : "",
      status,
    ]);
  }

  cardColor() {
    return cardStatuses(this.props.order, "color", "#ddd");
  }

  examLocation() {
    const {order} = this.props;
    return R.pathOr(null, ["rad_exam", "site_sublocation", "site_location", "location"], order);
  }

  openModal = () => {
    const {order} = this.props;
    this.props.openModal(order);
  }

  negativeDuration() {
    // TODO FIXME
    return false;
  }
}

export default BaseNotecard;
