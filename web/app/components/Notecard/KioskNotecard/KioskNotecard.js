// @flow
import React, {PureComponent} from "react";

import {
  kioskNumber,
} from "../../../lib/utility";

import type {
  Order,
} from "../../../types";

type Props = {
  cardClass: string,
  cardColor: string,
  order: Order,
  startDate: number,
  style: Object,
  type: "calendar" | "overview" | "kiosk",
}

class KioskNotecard extends PureComponent<Props> {
  render() {
    const {order} = this.props;
    const cardId = `${this.props.type === "overview" ? "fixed" : "scaled"}-card-${order.id}`;
    return (
      <div className={this.props.cardClass} id={cardId} style={this.props.style} onClick={this.openModal}>
        <div className="left-tab" style={{backgroundColor: this.props.cardColor}} />
        <div className="right-tab">
          <div className="heading">
            <div className="kiosk-number">{kioskNumber(this.props.order.id)}</div>
          </div>
        </div>
        <div className="hide data" data-order-id="{order.id}"></div>
      </div>
    );
  }

  openModal = () => {}
}

export default KioskNotecard;
