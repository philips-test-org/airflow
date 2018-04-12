// @flow
import React, {PureComponent} from "react";
import * as R from "ramda";

import {
  kioskNumber,
} from "../../../lib/utility";

import {NAVBAR_OFFSET} from "../../../lib/constants";

import type {
  Order,
} from "../../../types";

type Props = {
  cardClass: string,
  cardColor: string,
  order: Order,
  orderHeight: number,
  orderTop: number,
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
    return (
      <div className={this.props.cardClass} id={cardId} style={style} onClick={this.openModal}>
        <div className="left-tab" style={tabStyle} />
        <div className="right-tab">
          {this.renderKioskNumber()}
        </div>
        <div className="hide data" data-order-id="{order.id}"></div>
      </div>
    );
  }

  renderKioskNumber() {
    const {order} = this.props;
    const kioskNumberStyle = {fontSize: `${this.fontSize()}px`};
    const className = this.shiftKioskNumber() ? "kiosk-number bottom" : "kiosk-number";
    return (
      <div className={className} style={kioskNumberStyle}>{kioskNumber(order.id)}</div>
    )
  }

  fontSize(): number {
    const {orderHeight} = this.props;
    if (orderHeight < DEFAULT_FONT_SIZE) {return orderHeight / 2}
    return DEFAULT_FONT_SIZE;
  }

  shiftKioskNumber(): boolean {
    const {orderTop, orderHeight} = this.props;
    const gridTop = Math.abs(R.prop("top", document.getElementById("time-grid").getBoundingClientRect()));
    const gridTopWithHeaderOffset = gridTop + (NAVBAR_OFFSET / 2);
    const cardScrolledOffscreen = orderTop < gridTopWithHeaderOffset;
    const numberScrolledOffscreen = (orderTop - (orderHeight / 3) <= gridTopWithHeaderOffset);
    return cardScrolledOffscreen && numberScrolledOffscreen;
  }

  openModal = () => {}
}

export default KioskNotecard;
