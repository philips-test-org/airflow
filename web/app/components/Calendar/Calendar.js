// @flow
import React, {Component} from "react";
import * as R from "ramda";
import {DragDropContext} from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import {wrapEvent} from "../../lib/data";

import NotecardLane from "../NotecardLane";
import RightNow from "./RightNow";

import type {
  Order,
  Resource,
  User,
} from "../../types";

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
}

class Calendar extends Component<Props> {
  render() {
    const {style} = this.props;
    const lanes = R.map(
      ([resourceId, orders]) => this.renderLane(resourceId, orders),
      R.toPairs(this.props.orders)
    );

    return (
      <div className="grid-wrapper">
        <table id="time-grid">
          <thead>
            <tr className="heading">
              <th className="fixed-column fixed-row" style={style.th}>
                <div className="header-spacer">&nbsp;</div>
              </th>
              {R.map(this.renderHeading, R.keys(this.props.orders))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td id="hourbar" className="fixed-column" style={style.td}>
                {this.renderHours()}
              </td>
              {lanes}
            </tr>
          </tbody>
        </table>

        {this.renderRightNow()}
      </div>
    )
  }

  renderHeading = (resourceId: string) => {
    const resourceName = this.props.selectedResources[resourceId];
    const style = {
      transform: `translateY(${this.props.headerOffset}px)`,
    };
    return (
      <th key={`${resourceName}-heading`} className="relative-column fixed-row" style={style}>
        <div className="header-spacer">{resourceName}</div>
      </th>
    )
  }

  renderLane(resourceId: string, orders: Array<Order>) {
    const resourceName = this.props.selectedResources[resourceId];
    return (
      <NotecardLane
        key={`${resourceId}-lane`}
        updateOrderTime={this.updateOrderTime}
        header={resourceName}
        orders={orders}
        openModal={this.props.openModal}
        resourceId={resourceId}
        startDate={this.props.startDate}
        type="calendar"
      />
    )
  }

  renderRightNow() {
    if (!this.props.ordersLoaded) {return null}
    return (<RightNow width={this.props.boardWidth}/>);
  }

  renderHours() {
    return R.map((h) => {
      let hourString = R.length(String(h)) === 1 ? `0${h}:00` : `${h}:00`;
      return (
        <div key={`hour-${hourString}`} className="hour">
          {hourString}
        </div>
      )
    }, R.range(0, 24));
  }

  updateOrderTime = (orderId: number, newState: Object) => {
    const {currentUser} = this.props;
    this.props.adjustOrder(
      wrapEvent(orderId, currentUser.id, "location_update", null, newState)
    );

  }
}

export default DragDropContext(HTML5Backend)(Calendar);
