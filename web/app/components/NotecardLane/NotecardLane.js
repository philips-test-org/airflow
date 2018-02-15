// @flow
import React, {Component} from "react";
import * as R from "ramda";

import {orderComments} from "../../lib/utility";

import Notecard from "../Notecard";

import type {Order} from "../../types";

type Props = {
  orders: Array<Order>,
  openModal: (Order) => void,
  type: "calendar" | "overview" | "kiosk",
}

class NotecardLane extends Component {
  render() {
    return (
      R.map((order) => (
        <Notecard
          key={order.id}
          order={order}
          openModal={this.props.openModal}
          comments={orderComments(order)}
          type={this.props.type}
        />
      ), this.props.orders)
    );
  }
}

export default NotecardLane;
