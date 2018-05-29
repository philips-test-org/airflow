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
  scrollToTop: () => void,
  selectedResources: {[string]: string},
  startDate: number,
  boardWidth: number,
}

class Overview extends PureComponent<Props> {
  componentDidMount() {
    this.props.scrollToTop();
  }

  render() {
    const resourceRows = R.map(this.renderRow, R.keys(this.props.selectedResources));
    return (
      <div>
        {resourceRows}
      </div>
    );
  }

  renderRow = (resourceId: string) => {
    const orders = this.props.orders[resourceId] || [];
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
