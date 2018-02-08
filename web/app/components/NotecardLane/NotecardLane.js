// @flow
import React, {Component} from 'react';
import * as R from "ramda";

import {orderComments} from "../../lib/utility";

import Notecard from "../Notecard";

import type {Order} from "../../types";

type Props = {
  orders: Array<Order>,
  type: "calendar" | "overview" | "kiosk",
}

class NotecardLane extends Component {
  render() {
    return (
      R.map((order) => (
        <Notecard
          key={order.id}
          order={order}
          comments={orderComments(order)}
          type={this.props.type}
          />
      ), this.props.orders)
    );
  }
}

export default NotecardLane;
