// @flow
import React, {Component} from "react";
import * as R from "ramda";
import {throttle} from "lodash";
import moment from "moment";

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
  fetchCurrentEmployee: () => void,
  fetchExams: (selectedResourceGroup: string, resourceIds: Array<number>, date?: number) => void,
  fetchInitialApp: (type: ViewType, date?: number) => void,
  fetchKioskExams: (selectedResourceGroup: string, resourceIds: Array<number>, date?: number) => void,
  focusedOrder: Order,
  images: Images,
  loading: boolean,
  openModal: (Order) => void,
  orderGroups: {[string]: Array<Order>},
  orders: {[string]: Array<Order>},
  ordersLoaded: boolean,
  redirectToSSO: (ssoUrl: string, destination: ViewType) => void,
  resources: {[string]: Array<Resource>},
  selectedResourceGroup: string,
  selectedResources: {[string]: string},
  showModal: boolean,
  ssoUrl: string,
  startDate: number,
  type: ViewType,
  updateBrowserHistory: (state: {viewType: ViewType}, title: string, path: string) => void,
  updateDate: (date: moment) => void,
  updateSelectedResourceGroup: (resources: {[string]: Array<Resource>}, selectedResourceGroup: string) => void,
  updateViewType: (updatedView: ViewType) => void,
}

type State = {
  boardWidth: number,
  gridPosition: {x: number, y: number},
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
    };
  }

  componentDidMount() {
    // Setup
    this.setupViewChangeHandlers();
    if (R.either(R.isNil, R.isEmpty)(this.props.orders)) {
      this.props.fetchInitialApp(this.props.type);
      if (this.props.type !== "kiosk") {
        this.props.fetchCurrentEmployee();
      }
    }

    // Manage state when user navigates back and forward with browser
    window.onpopstate = () => {
      const viewType = R.path(["state", "viewType"], history);
      if (!viewType || viewType === this.props.type) return;

      this.props.updateViewType(viewType);
      this.fetchExams(viewType);
      this.updateActiveLink(viewType);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const {type: newType} = this.props;
    const {type: oldType} = prevProps;
    if (oldType !== newType) {
      if (R.isEmpty(this.props.currentUser)) {
        if (oldType === "kiosk") {
          // If coming from kiosk and the current user isn't set, redirects
          // to login via SSO.
          this.props.redirectToSSO(this.props.ssoUrl, newType);
        } else {
          this.props.fetchCurrentEmployee();
        }
      } else if (R.contains("kiosk", [oldType, newType])) {
        // Refetch exams only if switching from kiosk to something else, or vise versa
        // and the currentUser is set.
        this.fetchExams(newType);
      } else {
        // If we're switching from calendar to overview, or vise versa, we need
        // to update the width since this is not going to pop a loading
        this.updateWidth();
      }
    }

    if (R.not(R.isEmpty(this.props.orders)) && !this.props.loading && prevProps.loading) {
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
          updateDate={this.props.updateDate}
          updateSelectedResourceGroup={this.props.updateSelectedResourceGroup}
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
    const elementId = R.equals("overview", this.props.type) ? "board" : "time-grid";

    const element = document.getElementById(elementId);
    const width = element ? element.scrollWidth : 0;

    if (width > 0) {
      this.setState({boardWidth: width});
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
      this.props.fetchKioskExams(this.props.selectedResourceGroup, R.keys(selectedResources))
    } else {
      this.props.fetchExams(this.props.selectedResourceGroup, R.keys(selectedResources))
    }
  }
}

export default Airflow;
