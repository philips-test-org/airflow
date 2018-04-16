// @flow
import React, {Component} from "react";
import * as R from "ramda";

import NotecardRow from "./NotecardRow";

import type {Order} from "../../types";

type Props = {
  openModal: (Order) => void,
  orders: {[string]: Array<Order>},
  selectedResources: {[string]: string},
  startDate: number,
  style: {th: Object, td: Object},
}

class Overview extends Component<Props> {
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
        label={resourceName}
        openModal={this.props.openModal}
        orders={orders}
        resourceId={resourceId}
        startDate={this.props.startDate}
        fixedColStyle={this.props.style.td}
      />
    )
  }
}

export default Overview;
