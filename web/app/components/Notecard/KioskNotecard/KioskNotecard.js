// @flow
import React, {PureComponent} from "react";
import * as R from "ramda";

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
  orderHeight: number,
  startDate: number,
  style: Object,
  type: "calendar" | "overview" | "kiosk",
}

const DEFAULT_FONT_SIZE = 36;

class KioskNotecard extends PureComponent<Props> {
  render() {
    const {order, orderHeight} = this.props;
    const cardId = `${this.props.type === "overview" ? "fixed" : "scaled"}-card-${order.id}`;
    const style = R.merge(this.props.style, {lineHeight: `${orderHeight}px`});
    const tabStyle = {backgroundColor: this.props.cardColor};
    const kioskNumberStyle = {fontSize: `${this.fontSize()}px`};
    return (
      <div className={this.props.cardClass} id={cardId} style={style} onClick={this.openModal}>
        <div className="left-tab" style={tabStyle} />
        <div className="right-tab">
          <div className="kiosk-number" style={kioskNumberStyle}>{kioskNumber(this.props.order.id)}</div>
        </div>
        <div className="hide data" data-order-id="{order.id}"></div>
      </div>
    );
  }

  fontSize(): number {
    const {orderHeight} = this.props;
    if (orderHeight < DEFAULT_FONT_SIZE) {return orderHeight / 2}
    return DEFAULT_FONT_SIZE;
  }

  openModal = () => {}
}

export default KioskNotecard;
