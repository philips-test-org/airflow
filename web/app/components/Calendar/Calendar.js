// @flow
import React, {Component} from "react";
import * as R from "ramda";

import NotecardLane from "../NotecardLane";
import OrderModal from "../OrderModal";

import type {
  Order,
  Resource,
  User,
} from "../../types";

type Props = {
  avatarMap: {[number]: Blob},
  closeModal: () => void,
  currentUser: User,
  fetchAvatar: (userId: number) => void,
  fetchExams: (resourceIds: Array<number>) => void,
  focusedOrder: Order,
  openModal: (Order) => void,
  orders: {[string]: Array<Order>},
  orderGroups: {[string]: Array<Order>},
  resources: {[string]: Array<Resource>},
  selectedResourceGroup: string,
  selectedResources: Array<Resource>,
  showModal: boolean,
  startDate: number,
}

class Calendar extends Component {
  componentWillMount() {
    const {selectedResources} = this.props;
    this.props.fetchExams(R.pluck("id", selectedResources))
  }

  render() {
    const lanes = R.map(
      ([header, orders]) => this.renderLane(header, orders),
      R.toPairs(this.props.orders)
    );

    return (
      <div>
        <div id="board-headings">
          <div id="white-spacer">
          </div>

          <table id="time-headings">
            <tbody>
              <tr className="heading">
                <td></td>
                {R.map(this.renderHeading, R.keys(this.props.orders))}
              </tr>
            </tbody>
          </table>
        </div>

        <div id="board">
          <table id="vertical-time-headings">
            <tbody>
              <tr>
                <td>
                  {this.renderHours()}
                </td>
              </tr>
            </tbody>
          </table>

          <div id="right-now"></div>

          <table id="time-grid">
            <tbody>
              <tr>
                {lanes}
              </tr>
            </tbody>
          </table>
        </div>

        {this.renderOrderModal()}
      </div>
    );
  }

  renderHeading(resourceName) {
    return (
      <td key={`${resourceName}-heading`}>
        <h1>{resourceName}</h1>
      </td>
    )
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

  renderLane(header, orders) {
    return (
      <td key={`${header}-lane`}>
        <div className="markers">
          {R.map((hour) => {
            return (
              <div key={`${hour}-marker`} className="row-marker"></div>
            )
          }, R.range(0, 48))}
        </div>
        <NotecardLane
          orders={orders}
          openModal={this.props.openModal}
          type="calendar"
        />
      </td>
    )
  }

  renderOrderModal() {
    if (!this.props.showModal) {return null}
    return (
      <OrderModal
        avatarMap={this.props.avatarMap}
        closeModal={this.props.closeModal}
        currentUser={this.props.currentUser}
        fetchAvatar={this.props.fetchAvatar}
        order={this.props.focusedOrder}
        orderGroup={this.orderGroup(this.props.focusedOrder)}
      />
    )
  }

  orderGroup(order) {
    return this.props.orderGroups[order.groupIdentity]
  }
}

export default Calendar;
