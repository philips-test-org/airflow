// @flow
import React, {Component} from "react";
import * as R from "ramda";

import {orderComments} from "../../../lib/utility";

import BaseNotecard from "../../Notecard/BaseNotecard";

import type {Order} from "../../../types";

type Props = {
  filteredOrderIds: Array<number>,
  fixedColStyle: Object,
  focusedOrderId: number,
  headerOffset: number,
  label: string,
  orders: Array<Order>,
  openModal: (Order) => void,
  resourceId: string,
  scrollToCoordinates: (x: number, y: number) => void,
  startDate: number,
  type: "overview",
  boardWidth: number,
}

class NotecardRow extends Component<Props> {
  row: ?HTMLElement;
  header: ?HTMLElement;

  shouldComponentUpdate(nextProps: Props) {
    return !R.equals(nextProps, this.props);
  }

  scrollToY = (y: number) => {
    if (this.row) {
      const rowY = this.row.offsetTop;
      this.props.scrollToCoordinates(0, y + rowY);
    }
  }

  render() {
    const {orders, label} = this.props;
    const cards = R.map(this.renderCard, orders)
    const headerStyle = {top: this.getHeaderPosition()};
    return (
      <div
        className="resource-row"
        ref={el => {if (el) this.row = el}}
      >
        <div className="row-label">
          <h1
            style={headerStyle}
            ref={el => this.header = el}
          >
            {label}
          </h1>
        </div>
        <div className="cards">
          {cards}
        </div>
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
      scrollToY={this.scrollToY}
      startDate={this.props.startDate}
      type="overview"
    />
  )

  getHeaderPosition() {
    let headerPosition = 0;
    if (this.row && this.header) {
      const rowHeight = this.row.offsetHeight;
      const rowOffset = this.row.offsetTop;
      const headerHeight = this.header.offsetHeight;

      // If we scrolled to the header, stick it to the top
      if (this.props.headerOffset > rowOffset) {
        headerPosition = this.props.headerOffset - rowOffset;
      }
      // If we are scrolling off this row, stick it to the bottom
      if (this.props.headerOffset > rowOffset + rowHeight - headerHeight) {
        headerPosition = rowHeight - headerHeight;
      }
    }

    return headerPosition;
  }
}

export default NotecardRow;
