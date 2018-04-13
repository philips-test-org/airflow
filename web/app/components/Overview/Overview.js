// @flow
import React, {Component} from "react";
import * as R from "ramda";

import NotecardRow from "./NotecardRow";

type Props = {
  adjustOrder: (event: Object) => void,
  avatarMap: {[number]: Blob},
  boardWidth: number,
  closeModal: () => void,
  currentUser: User,
  fetchAvatar: (userId: number) => void,
  fetchExams: (resourceIds: Array<number>, date?: number) => void,
  focusedOrder: Order,
  headerOffset: number,
  openModal: (Order) => void,
  orders: {[string]: Array<Order>},
  ordersLoaded: boolean,
  orderGroups: {[string]: Array<Order>},
  resources: {[string]: Array<Resource>},
  selectedResourceGroup: string,
  selectedResources: {[string]: string},
  showModal: boolean,
  startDate: number,
  style: {th: Object, td: Object},
  type: "calendar" | "overview" | "kiosk",
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
      />
    )
  }
}

export default Overview;
