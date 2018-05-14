// @flow
import React, {Component} from "react";
import * as R from "ramda";

import NotecardLane from "../NotecardLane";

import type {
  Order,
  ViewType,
} from "../../types";

type Props = {
  filteredOrderIds: Array<number>,
  focusedOrderId: number,
  openModal: (Order) => void,
  orders: {[string]: Array<Order>},
  scrollToCoordinates: (x: number, y: number) => void,
  selectedResources: {[string]: string},
  startDate: number,
  type: ViewType,
  updateOrderTime: (orderId: number, newState: Object) => void,
  updateWidth: (number) => void,
}

class NotecardLanes extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    const omitFns = R.omit(["updateWidth"]);
    return !R.equals(omitFns(nextProps), omitFns(this.props));
  }

  renderLane(resourceId: string, orders: Array<Order>) {
    const resourceName = this.props.selectedResources[resourceId];
    return (
      <NotecardLane
        key={`${resourceId}-lane`}
        filteredOrderIds={this.props.filteredOrderIds}
        focusedOrderId={this.props.focusedOrderId}
        header={resourceName}
        openModal={this.props.openModal}
        orders={orders}
        resourceId={resourceId}
        scrollToCoordinates={this.props.scrollToCoordinates}
        showGhostEndTime
        startDate={this.props.startDate}
        type={this.props.type}
        updateOrderTime={this.props.updateOrderTime}
        updateWidth={this.props.updateWidth}
      />
    )
  }

  render() {
    return R.map(
      ([resourceId, orders]) => this.renderLane(resourceId, orders),
      R.toPairs(this.props.orders)
    );
  }
}

export default NotecardLanes;

