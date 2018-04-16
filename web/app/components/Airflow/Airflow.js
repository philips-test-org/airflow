// @flow
import React, {Component} from "react";
import * as R from "ramda";
import {throttle} from "lodash";

import Calendar from "../Calendar";
import Overview from "../Overview";
import OrderModal from "../OrderModal";
import ViewControls from "../ViewControls";

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
  fetchExams: (resourceIds: Array<number>, date?: number) => void,
  fetchKioskExams: (resourceIds: Array<number>, date?: number) => void,
  focusedOrder: Order,
  openModal: (Order) => void,
  orders: {[string]: Array<Order>},
  ordersLoaded: boolean,
  orderGroups: {[string]: Array<Order>},
  resources: {[string]: Array<Resource>},
  selectedResourceGroup: string,
  selectedResources: {[string]: string},
  showModal: boolean,
  startDate: number,
}

type State = {
  boardWidth: number,
  gridPosition: {x: number, y: number},
}

class Airflow extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      boardWidth: 0,
      gridPosition: {x: 0, y: 0},
    };
  }

  componentWillMount() {
    if (R.either(R.isNil, R.isEmpty)(this.props.orders)) {
      this.fetchExams();
    }
  }

  componentWillReceiveProps(newProps: Props) {
    if (this.props.type !== newProps.type) {
      this.fetchExams();
    }
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
    const BodyComponent = this.props.type === "overview" ? Overview : Calendar;
    const translateX = Math.abs(this.state.gridPosition.x);
    const tdStyle = {
      transform: `translateX(${translateX}px)`,
    };
    const thStyle = {
      position: "relative",
      transform: `translate(${translateX}px, ${this.headerOffset()}px)`,
      zIndex: 110,
    };
    const scrollStyle = {
      td: tdStyle,
      th: thStyle,
    };

    return (
      <div>
        <ViewControls
          resources={this.props.resources}
          selectedDate={this.props.startDate}
          selectedResourceGroup={this.props.selectedResourceGroup}
          fetchExams={this.props.fetchExams}
        />
        <div id="board" onScroll={throttle(this.updateScrollPosition, 100)}>
          <BodyComponent
            style={scrollStyle}
            headerOffset={this.headerOffset()}
            boardWidth={this.state.boardWidth}
            gridPosition={this.state.gridPosition}
            {...this.props}
          />
          {this.renderOrderModal()}
        </div>
      </div>
    );
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
        resourceMap={this.props.selectedResources}
        startDate={this.props.startDate}
      />
    )
  }

  headerOffset = () => {
    if (this.state.gridPosition.y === 0) {return 0}
    return R.max(0, NAVBAR_OFFSET + R.negate(this.state.gridPosition.y));
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
    const element = document.getElementById("time-grid")
    const width = element ? element.scrollWidth : 0;
    this.setState({boardWidth: width});
  }

  fetchExams() {
    const {selectedResources} = this.props;
    if (this.props.type === "kiosk") {
      this.props.fetchKioskExams(R.keys(selectedResources))
    } else {
      this.props.fetchExams(R.keys(selectedResources))
    }
  }
}

export default Airflow;
