// @flow
import React, {Component} from "react";
import * as R from "ramda";
import {DropTarget} from "react-dnd";

import {ItemTypes} from "../../lib/constants";

import {orderComments} from "../../lib/utility";

import Notecard from "../Notecard";

import type {Order} from "../../types";

type Props = {
  connectDropTarget: Function,
  header: string,
  isOver: boolean,
  orders: Array<Order>,
  openModal: (Order) => void,
  movedOrder: Order,
  movementOffset: {x: number, y: number},
  startDate: number,
  type: "calendar" | "overview" | "kiosk",
  updateOrderTime: (orderId: number, resourceId: number, newState: Object) => void,
}

// React DnD setup
const laneTarget = {
  drop(props, monitor) {
    const movementOffset = monitor.getDifferenceFromInitialOffset();
    return {
      targetResourceId: props.resourceId,
      movementDelta: movementOffset,
    }
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    movementOffset: monitor.getClientOffset(),
    movedOrder: monitor.getItem(),
  };
}

// React component
class NotecardLane extends Component<Props> {
  render() {
    const {connectDropTarget, isOver, header} = this.props;
    return connectDropTarget(
      <td key={`${header}-lane`} className="relative-column">
        <div className="markers">
          {R.map((hour) => {
            return (
              <div key={`${hour}-marker`} className="row-marker"></div>
            )
          }, R.range(0, 48))}
        </div>
        <div style={{height: "100%"}}>
          {this.renderCards()}
          {isOver ? <div style={{zIndex: 200, opacity: 0.5, backgroundColor: "red"}} /> : null}
        </div>
      </td>
    );
  }

  renderCards() {
    return (
      R.map((order) => (
        <Notecard
          key={order.id}
          order={order}
          openModal={this.props.openModal}
          comments={orderComments(order)}
          startDate={this.props.startDate}
          type={this.props.type}
          updateOrderTime={this.props.updateOrderTime}
        />
      ), this.props.orders)
    )
  }
}

export default DropTarget(ItemTypes.NOTECARD, laneTarget, collect)(NotecardLane);
