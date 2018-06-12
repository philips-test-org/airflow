// @flow
import React, {Fragment, PureComponent} from "react";
import * as R from "ramda";

import {
  cardStatuses,
  formatName,
  getPatientMrn,
  getPatientName,
  getPatientType,
  getProcedure,
  orderingPhysician,
} from "../../../lib/utility";

import type {
  MergedOrder,
  Order,
} from "../../../types";

type Props = {
  comments: Object,
  isFiltered: boolean,
  isFocused: boolean,
  openModal: (order: Order | MergedOrder) => void,
  order: Order | MergedOrder,
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
    const {color, card_class} = this.cardStatus();
    const cardClass = `notecard ${this.cardClass(card_class)}`;
    return (
      <div
        className={cardClass}
        id={cardId}
        style={style}
        onClick={this.openModal}
        ref={el => this.card = el}
      >
        <div className="left-tab" style={{backgroundColor: color}} />

        <div className="right-tab">
          <div className="events">
            {hasComments ? <i className="fa fa-paperclip"></i> : null}
            {R.prop("merged", order) ? <i className="fa fa-compress"></i> : null}
          </div>

          {this.renderHeader()}

          <div className="body">
            {this.renderAllProcedures()}
          </div>

          {this.renderFooter()}
        </div>
        <div className="hide data" data-order-id="{order.id}"></div>
      </div>
    );
  }

  renderHeader() {
    const patientType = getPatientType(this.props.order);
    const patientName = getPatientName(this.props.order);
    const patientMrn = getPatientMrn(this.props.order);
    if (!patientName) {return null}
    const formattedName = formatName(patientName);
    return (
      <div className="heading">
        <div className="patient-name">{formattedName}</div>
        <div className="patient-type">{patientType}</div>
        <div className="mrn">{patientMrn}</div>
      </div>
    );
  }

  renderAllProcedures() {
    const {order} = this.props;
    if (order.merged) {
      return R.map((o) => this.renderProcedure(o.procedure, o.orderedBy), order.procedures);
    } else {
      const procedure = getProcedure(order);
      const orderedBy = orderingPhysician(order);
      if (typeof procedure == "string") {
        return this.renderProcedure(procedure, orderedBy);
      }
    }
    return null;
  }

  renderProcedure(procedure: string, orderedBy: string) {
    return (
      <Fragment key={`procedure-${procedure}-${orderedBy}`}>
        <div className="procedure">{procedure}</div>
        <div className="patient-location">{this.examLocation()}</div>
        <div className="ordering-physician">Ordered by: {orderedBy}</div>
      </Fragment>
    )
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
          {adjusted.ppca_arrival ? <div className="status-indicator ppca_ready"><i className="fa fa-thumbs-o-up"></i></div> : null}
          {adjusted.paperwork ? <div className="status-indicator paperwork"><i className="fa fa-file-text"></i></div> : null}
        </div>
      </div>
    )
  }

  cardClass(statusClass: string) {
    const {type} = this.props;
    const status = type === "kiosk" ? "" : statusClass;
    return R.join(" ", [
      this.props.type === "overview" ? "overview" : "scaled",
      this.negativeDuration() ? "bad-duration" : "",
      this.props.isFiltered ? "filtered" : "",
      status,
    ]);
  }

  cardStatus() {
    const {order} = this.props;
    return R.has("cardStatus", order) ? R.prop("cardStatus", order) :
      cardStatuses(order, ["color", "card_class"], {color: "#ddd"});
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
