// @flow
import React, {Component} from "react";
import * as R from "ramda";
import {throttle} from "lodash";

import NotecardLane from "../NotecardLane";
import OrderModal from "../OrderModal";
import RightNow from "./RightNow";

import {
  NAVBAR_OFFSET,
} from "../../lib/constants";

import type {
  Order,
  Resource,
  User,
} from "../../types";

type Props = {
  adjustOrder: (event: Object) => void,
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

type State = {
  boardWidth: number,
  gridPosition: Object,
}

class Calendar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      boardWidth: 0,
      gridPosition: {x: 0, y: 0},
    };
  }

  componentWillMount() {
    const {selectedResources} = this.props;
    this.props.fetchExams(R.pluck("id", selectedResources))
  }

  componentDidMount() {
    this.updateWidth();
  }

  componentDidUpdate(prevProps: Props) {
    if (R.not(R.isEmpty(this.props.orders)) && R.not(R.equals(prevProps.orders, this.props.orders))) {
      this.updateWidth();
    }
  }

  render() {
    const lanes = R.map(
      ([header, orders]) => this.renderLane(header, orders),
      R.toPairs(this.props.orders)
    );

    const translateX = Math.abs(this.state.gridPosition.x);
    const tdStyle = {
      transform: `translateX(${translateX}px)`,
    };
    const thStyle = {
      position: "relative",
      transform: `translate(${translateX}px, ${this.headerOffset()}px)`,
      zIndex: 110,
    };

    return (
      <div id="board" onScroll={throttle(this.updateScrollPosition, 100)}>
        <table id="time-grid">
          <thead>
            <tr className="heading">
              <th className="fixed-column fixed-row" style={thStyle}>
                <div className="header-spacer">&nbsp;</div>
              </th>
              {R.map(this.renderHeading, R.keys(this.props.orders))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td id="hourbar" className="fixed-column" style={tdStyle}>
                {this.renderHours()}
              </td>
              {lanes}
            </tr>
          </tbody>
        </table>

        <RightNow width={this.state.boardWidth}/>

        {this.renderOrderModal()}
      </div>
    );
  }

  renderHeading = (resourceName: string) => {
    const style = {
      transform: `translateY(${this.headerOffset()}px)`,
    };
    return (
      <th key={`${resourceName}-heading`} className="relative-column fixed-row" style={style}>
        <div className="header-spacer">{resourceName}</div>
      </th>
    )
  }

  headerOffset = () => {
    return R.max(0, NAVBAR_OFFSET + R.negate(this.state.gridPosition.y));
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

  renderLane(header: string, orders: Array<Order>) {
    return (
      <td key={`${header}-lane`} className="relative-column">
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
        adjustOrder={this.props.adjustOrder}
        avatarMap={this.props.avatarMap}
        closeModal={this.props.closeModal}
        currentUser={this.props.currentUser}
        fetchAvatar={this.props.fetchAvatar}
        order={this.props.focusedOrder}
        orderGroup={this.orderGroup(this.props.focusedOrder)}
      />
    )
  }

  orderGroup(order: Order) {
    return this.props.orderGroups[order.groupIdentity]
  }

  updateScrollPosition = (event: SyntheticUIEvent<>) => {
    const t = R.pathOr(null, ["target", "firstChild"], event);
    if (t) {
      const position = R.pick(["x", "y"], t.getBoundingClientRect());
      this.setState({gridPosition: position});
    }
  }

  updateWidth() {
    const element = document.getElementById("board")
    const width = element ? element.scrollWidth : 0;
    this.setState({boardWidth: width});
  }
}

export default Calendar;
