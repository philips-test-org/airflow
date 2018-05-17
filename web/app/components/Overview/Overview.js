// @flow
import React, {PureComponent} from "react";
import * as R from "ramda";

import NotecardRow from "./NotecardRow";

import type {Order} from "../../types";

type Props = {
  filteredOrderIds: Array<number>,
  focusedOrderId: number,
  headerOffset: number,
  openModal: (Order) => void,
  orders: {[string]: Array<Order>},
  scrollToCoordinates: (x: number, y: number) => void,
  selectedResources: {[string]: string},
  startDate: number,
  boardWidth: number,
}

class Overview extends PureComponent<Props> {
  componentDidMount() {
    if (this.props.filteredOrderIds.length == 0) {
      this.props.scrollToCoordinates(0,0);
    }
  }

  render() {
    const resourceRows = R.map(
      ([resourceId, orders]) => this.renderRow(resourceId, orders),
      R.toPairs(this.props.orders)
    );
    return (
      <div>
        {resourceRows}
      </div>
    );
  }

  renderRow = (resourceId: string, orders: Array<Order>) => {
    const resourceName = this.props.selectedResources[resourceId];
    return (
      <NotecardRow
        key={`${resourceId}-row`}
        filteredOrderIds={this.props.filteredOrderIds}
        focusedOrderId={this.props.focusedOrderId}
        headerOffset={this.props.headerOffset}
        label={resourceName}
        openModal={this.props.openModal}
        orders={orders}
        resourceId={resourceId}
        scrollToCoordinates={this.props.scrollToCoordinates}
        startDate={this.props.startDate}
        boardWidth={this.props.boardWidth}
      />
    )
  }
}

export default Overview;
