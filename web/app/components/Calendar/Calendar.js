// @flow
import React, {Component} from "react";
import * as R from "ramda";
import {DragDropContext} from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import {wrapEvent} from "../../lib/data";

import NotecardLanes from "./NotecardLanes";
import RightNow from "./RightNow";

import type {
  Order,
  Resource,
  User,
  ViewType,
} from "../../types";

type Props = {
  adjustOrder: (event: Object) => void,
  avatarMap: {[number]: Blob},
  boardWidth: number,
  closeModal: () => void,
  currentUser: User,
  fetchAvatar: (userId: number) => void,
  fetchExams: (resourceIds: Array<number>, date?: number) => void,
  filteredOrderIds: Array<number>,
  focusedOrderId: number,
  headerOffset: number,
  openModal: (Order) => void,
  orders: {[string]: Array<Order>},
  ordersLoaded: boolean,
  orderGroups: {[string]: Array<Order>},
  resources: {[string]: Array<Resource>},
  scrollToCoordinates: (x: number, y: number) => void,
  selectedResourceGroup: string,
  selectedResources: {[string]: string},
  showModal: boolean,
  startDate: number,
  style: {th: Object, td: Object},
  type: ViewType,
  updateWidth: (number) => void,
}

class Calendar extends Component<Props> {
  hourbar: ?HTMLElement;

  shouldComponentUpdate(nextProps, nextState) {
    return !R.equals(nextProps, this.props) || !R.equals(nextState, this.state);
  }

  scrollToCoordinates = (x: number, y: number) => {
    if (this.hourbar) {
      const offset = this.hourbar.offsetWidth;
      this.props.scrollToCoordinates(x - offset, y);
    }
  }

  render() {
    const {style} = this.props;

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
              <td
                id="hourbar"
                className="fixed-column"
                style={style.td}
                ref={el => this.hourbar = el}
              >
                {this.renderHours()}
              </td>
              <NotecardLanes
                openModal={this.props.openModal}
                orders={this.props.orders}
                filteredOrderIds={this.props.filteredOrderIds}
                focusedOrderId={this.props.focusedOrderId}
                scrollToCoordinates={this.scrollToCoordinates}
                selectedResources={this.props.selectedResources}
                startDate={this.props.startDate}
                type={this.props.type}
                updateOrderTime={this.updateOrderTime}
                updateWidth={this.props.updateWidth}
              />
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
