// @flow
import React, {PureComponent} from "react";
import * as R from "ramda";

import {orderComments} from "../../../lib/utility";

import BaseNotecard from "../../Notecard/BaseNotecard";

import type {Order} from "../../../types";

type Props = {
  filteredOrderIds: Array<number>,
  fixedColStyle: Object,
  focusedOrderId: number,
  label: string,
  orders: Array<Order>,
  openModal: (Order) => void,
  resourceId: string,
  scrollToCoordinates: (x: number, y: number) => void,
  startDate: number,
  type: "overview",
  boardWidth: number,
}

class NotecardRow extends PureComponent<Props> {
  row: ?HTMLElement;
  header: ?HTMLElement;

  scrollToX = (x: number) => {
    if (this.row && this.header) {
      const y = this.row.offsetTop;
      const offset = this.header.offsetWidth;
      this.props.scrollToCoordinates(x - offset, y);
    }
  }

  render() {
    const {fixedColStyle, orders, label, boardWidth} = this.props;
    const cards = R.map(this.renderCard, orders)
    const transformStyle = {transform: `${fixedColStyle.transform} rotate(-90deg)`};
    return (
      <div
        className="resource-row"
        style={{width: boardWidth}}
        ref={el => {if (el) this.row = el}}
      >
        <h1
          style={transformStyle}
          ref={el => this.header = el}
        >
          {label}
        </h1>
        {cards}
      </div>
    );
  }

  renderCard = (order: Order) => (
    <BaseNotecard
      key={order.id}
      comments={orderComments(order)}
      isFiltered={R.contains(order.id, this.props.filteredOrderIds)}
      isFocused={this.props.focusedOrderId === order.id}
      openModal={this.props.openModal}
      order={order}
      resourceId={this.props.resourceId}
      scrollToX={this.scrollToX}
      startDate={this.props.startDate}
      type="overview"
    />
  )
}

export default NotecardRow;
