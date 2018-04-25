// @flow
import React, {PureComponent} from "react";
import * as R from "ramda";
import {DropTarget} from "react-dnd";

import {ItemTypes} from "../../lib/constants";

import {orderComments} from "../../lib/utility";

import ScaledCard from "../Notecard/ScaledCard";
import DraggableNotecard from "../Notecard";
import KioskNotecard from "../Notecard/KioskNotecard";

import type {Order} from "../../types";

type Props = {
  connectDropTarget: Function,
  filteredOrderIds: Array<Order>,
  header: string,
  isOver: boolean,
  orders: Array<Order>,
  openModal: (Order) => void,
  movedOrder: Order,
  movementOffset: {x: number, y: number},
  resourceId: string,
  startDate: number,
  type: "calendar" | "kiosk",
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
class NotecardLane extends PureComponent<Props> {
  render() {
    if (this.props.type === "kiosk") {
      return this.renderLane();
    }
    return this.props.connectDropTarget(this.renderLane());
  }

  renderLane() {
    const {isOver, header} = this.props;
    const tdStyle = isOver ? {opacity: 0.33, backgroundColor: "lightgray"} : {}
    return (
      <td key={`${header}-lane`} className="relative-column">
        <div className="markers" style={tdStyle}>
          {R.map((hour) => {
            return (
              <div key={`${hour}-marker`} className="row-marker"></div>
            )
          }, R.range(0, 48))}
        </div>
        <div>
          {this.renderCards()}
        </div>
      </td>
    )
  }

  renderCards() {
    const Component = this.props.type == "kiosk" ? ScaledCard(KioskNotecard) : DraggableNotecard;
    return (
      R.map((order) => (
        <Component
          key={order.id}
          comments={orderComments(order)}
          isFiltered={R.contains(order.id, this.props.filteredOrderIds)}
          openModal={this.props.openModal}
          order={order}
          resourceId={this.props.resourceId}
          startDate={this.props.startDate}
          type={this.props.type}
          updateOrderTime={this.props.updateOrderTime}
        />
      ), this.props.orders)
    )
  }
}

export default DropTarget(ItemTypes.NOTECARD, laneTarget, collect)(NotecardLane);
