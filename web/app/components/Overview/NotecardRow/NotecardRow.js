// @flow
import React, {Component} from "react";
import * as R from "ramda";

import {orderComments} from "../../../lib/utility";

import BaseNotecard from "../../Notecard/BaseNotecard";

import type {Order} from "../../../types";

type Props = {
  fixedColStyle: Object,
  label: string,
  orders: Array<Order>,
  openModal: (Order) => void,
  resourceId: string,
  startDate: number,
  type: "overview",
  boardWidth: number,
}

class NotecardRow extends Component<Props> {
  render() {
    const {fixedColStyle, orders, label, boardWidth} = this.props;
    const cards = R.map(this.renderCard, orders)
    const transformStyle = {transform: `${fixedColStyle.transform} rotate(-90deg)`};
    return (
      <div className="resource-row" style={{width: boardWidth}}>
        <h1 style={transformStyle}>{label}</h1>
        {cards}
      </div>
    );
  }

  renderCard = (order: Order) => (
    <BaseNotecard
      key={order.id}
      comments={orderComments(order)}
      openModal={this.props.openModal}
      order={order}
      resourceId={this.props.resourceId}
      startDate={this.props.startDate}
      type="overview"
    />
  )
}

export default NotecardRow;
