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
  Images,
  Order,
  Resource,
  User,
  ViewType,
} from "../../types";

type Props = {
  adjustOrder: (event: Object) => void,
  avatarMap: {[number]: Blob},
  closeModal: () => void,
  currentUser: User,
  fetchAvatar: (userId: number) => void,
  fetchExams: (resourceIds: Array<number>, date?: number) => void,
  fetchKioskExams: (resourceIds: Array<number>, date?: number) => void,
  fetchInitialApp: (type: ViewType, date?: number) => void,
  fetchCurrentEmployee: () => void,
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
  type: ViewType,
  images: Images,
  loading: boolean,
  updateBrowserHistory: (state: {viewType: ViewType}, title: string, path: string) => void,
  updateViewType: (updatedView: ViewType) => void,
}

type State = {
  boardWidth: number,
  gridPosition: {x: number, y: number},
  widthSet: false,
}

class Airflow extends Component<Props, State> {
  calendarLink: ?HTMLElement;
  overviewLink: ?HTMLElement;
  kioskLink: ?HTMLElement;

  constructor(props: Props) {
    super(props);

    this.state = {
      boardWidth: 0,
      gridPosition: {x: 0, y: 0},
      widthSet: false,
    };
  }

  componentWillMount() {
    this.setupViewChangeHandlers();
    if (R.either(R.isNil, R.isEmpty)(this.props.orders)) {
      this.props.fetchInitialApp(this.props.type);
      this.props.fetchCurrentEmployee();
    }
  }

  componentWillReceiveProps(newProps: Props) {
    if (this.props.type !== newProps.type) {
      this.fetchExams(newProps.type);
    }
  }

  componentDidMount() {
    this.updateWidth();

    window.onpopstate = () => {
      if (R.prop(["state", "viewType"], history) !== this.props.type) {
        this.props.updateViewType(history.state.viewType);
        this.fetchExams(history.state.viewType);
        this.updateActiveLink(history.state.viewType);
      }
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (R.not(R.isEmpty(this.props.orders)) && !this.props.loading && !this.state.widthSet) {
      this.updateWidth();
    }
  }

  render() {
    return (
      <div>
        <ViewControls
          fetchExams={this.props.fetchExams}
          resources={this.props.resources}
          selectedDate={this.props.startDate}
          selectedResourceGroup={this.props.selectedResourceGroup}
          viewType={this.props.type}
        />
        {this.props.loading
          ? <img src={this.props.images.spinner} />
          : this.renderBoard()}
      </div>
    );
  }

  renderBoard() {
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
    if (width > 0) {
      this.setState({boardWidth: width, widthSet: true});
    }
  }

  setupViewChangeHandlers() {
    this.kioskLink = document.getElementById("kiosk-link");
    if (this.kioskLink) {
      this.kioskLink.addEventListener("click", () => {this.viewClickHandler("kiosk", "/kiosk")})
    }

    this.calendarLink = document.getElementById("calendar-link");
    if (this.calendarLink) {
      this.calendarLink.addEventListener("click", () => {this.viewClickHandler("calendar", "/main/calendar")})
    }

    this.overviewLink = document.getElementById("overview-link");
    if (this.overviewLink) {
      this.overviewLink.addEventListener("click", () => {this.viewClickHandler("overview", "/main/overview")})
    }
  }

  viewClickHandler = (type: ViewType, path: string) => {
    const {updateBrowserHistory, updateViewType} = this.props;

    updateViewType(type);
    updateBrowserHistory({viewType: this.props.type}, type, path);
  }

  updateActiveLink(viewType: ViewType) {
    if (this.kioskLink && this.calendarLink && this.overviewLink) {
      switch (viewType) {
      case "kiosk":
        this.kioskLink.className = "active";
        this.calendarLink.className = "";
        this.overviewLink.className = "";
        break;
      case "calendar":
        this.kioskLink.className = "";
        this.calendarLink.className = "active";
        this.overviewLink.className = "";
        break;
      case "overview":
        this.calendarLink.className = "";
        this.kioskLink.className = "";
        this.overviewLink.className = "active";
        break;
      }
    }
  }

  fetchExams(viewType: ViewType) {
    const {selectedResources} = this.props;
    if (viewType === "kiosk") {
      this.props.fetchKioskExams(R.keys(selectedResources))
    } else {
      this.props.fetchExams(R.keys(selectedResources))
    }
    this.setState({widthSet: false});
  }
}

export default Airflow;
