// @flow
import React, {Component} from "react";
import * as R from "ramda";

import {orderComments} from "../../lib/utility";

import BaseNotecard from "../../Notecard/BaseNotecard";

import type {Order} from "../../../types";

type Props = {
  label: string,
  orders: Array<Order>,
  openModal: (Order) => void,
  resourceId: string,
  startDate: number,
  type: "overview",
}

class NotecardRow extends Component<Props> {
  render() {
    const {orders, label} = this.props;
    const cards = R.map(this.renderCard, orders)
    return (
      <div className="resource-row">
        <h1>{label}</h1>
        {cards}
      </div>
    );
  }

  renderCard(order: Order) {
    return (
      <BaseNotecard
        key={order.id}
        comments={orderComments(order)}
        openModal={this.props.openModal}
        order={order}
        resourceId={this.props.resourceId}
        startDate={this.props.startDate}
        type={this.props.type}
      />
    )
  }
}

export default NotecardRow;
