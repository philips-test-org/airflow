// @flow
import React, {Component} from "react";
import * as R from "ramda";
import {throttle} from "lodash";
import moment from "moment";
import key from "keymaster";

import Calendar from "../Calendar";
import Overview from "../Overview";
import OrderModal from "../OrderModal";
import ViewControls from "../ViewControls";
import ErrorBoundary from "../ErrorBoundary";
import PrintView from "../PrintView";

import {
  NAVBAR_OFFSET,
  SCROLL_SPEED,
} from "../../lib/constants";

import {
  printOrders,
} from "../../lib/utility";

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
  boardWidth: number,
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
  updateWidth: (updatedWidth: number) => void,
}

type State = {
  gridPosition: {x: number, y: number},
  filteredOrderIds: Array<number>,
  focusedOrderId: ?number,
}

class Airflow extends Component<Props, State> {
  calendarLink: ?HTMLElement;
  overviewLink: ?HTMLElement;
  kioskLink: ?HTMLElement;
  board: ?HTMLElement;

  constructor(props: Props) {
    super(props);

    this.state = {
      gridPosition: {x: 0, y: 0},
      filteredOrderIds: [],
      focusedOrderId: null,
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
    };

    key("⌘+p, ctrl+p", (event, _handler) => {
      event.preventDefault();
      printOrders();
    });
  }

  componentDidUpdate(prevProps: Props) {
    const {type: newType, updateWidth, boardWidth} = this.props;
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
        this.updateWidth(updateWidth, boardWidth);
      }
    }

    if (R.not(R.isEmpty(this.props.orders)) && !this.props.loading && prevProps.loading) {
      this.updateWidth(updateWidth, boardWidth);
    }
  }

  render() {
    return (
      <div>
        <ErrorBoundary id="view-controls">
          <ViewControls
            fetchExams={this.props.fetchExams}
            resources={this.props.resources}
            selectedDate={this.props.startDate}
            selectedResourceGroup={this.props.selectedResourceGroup}
            updateDate={this.props.updateDate}
            updateSelectedResourceGroup={this.props.updateSelectedResourceGroup}
            viewType={this.props.type}
            filterOrders={this.filterOrders}
          />
        </ErrorBoundary>
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
    const throttledWidthUpdate = throttle(
      () => this.updateWidth(this.props.updateWidth, this.props.boardWidth),
      500
    );

    return (
      <div
        id="board"
        onScroll={throttle(this.updateScrollPosition, 100)}
        ref={el => {if (el) this.board = el}}
      >
        <BodyComponent
          style={scrollStyle}
          headerOffset={this.headerOffset()}
          boardWidth={this.props.boardWidth}
          gridPosition={this.state.gridPosition}
          filteredOrderIds={this.state.filteredOrderIds}
          focusedOrderId={this.state.focusedOrderId}
          scrollToCoordinates={this.scrollToCoordinates}
          {...this.props}
          updateWidth={throttledWidthUpdate}
        />
        {this.renderOrderModal()}
        <PrintView
          orders={this.props.orders}
          selectedResources={this.props.selectedResources}
        />
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

  updateWidth = (f: (number) => void, currentWidth: number) => {
    const elementId = "time-grid";

    const element = document.getElementById(elementId);
    const width = element ? element.scrollWidth : 0;

    if (width && width > 0 && width != currentWidth) {
      f(width);
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

  filterOrders = (search: string) => {
    if (search === "") {
      return this.setState({filteredOrderIds: []});
    }

    // Find only orders that do NOT match the search string
    const ordersList = R.compose(R.flatten, R.values)(this.props.orders);
    const filteredOrderIds = R.pluck("id", R.reject(R.partial(this.orderMatchesSearchTerm, [search]), ordersList));

    // If only one result isn't filtered, make that the "focused" order
    const results = R.difference(R.pluck("id", ordersList), filteredOrderIds);
    const focusedOrderId = results.length === 1
      ? R.head(results) : null;

    this.setState({filteredOrderIds, focusedOrderId});
  }

  orderMatchesSearchTerm = (search: string, order: Order) => {
    const paths = [
      ["patient_mrn", "mrn"],
      ["patient_mrn", "patient", "name"],
      ["rad_exam", "accession"],
      ["procedure", "description"],
      ["rad_exam", "procedure", "description"],
      ["procedure", "code"],
      ["rad_exam", "procedure", "code"],
    ];

    return R.any(
      path => R.pathSatisfies(value => value ? value.match(new RegExp(search, "i")) : false, path, order)
    )(paths);
  }

  fetchExams(viewType: ViewType) {
    const {selectedResources} = this.props;
    if (viewType === "kiosk") {
      this.props.fetchKioskExams(this.props.selectedResourceGroup, R.keys(selectedResources))
    } else {
      this.props.fetchExams(this.props.selectedResourceGroup, R.keys(selectedResources))
    }
  }

  scrollToCoordinates = (x: number, y: number) => {
    if (this.board) {
      this.scrollToX(x);
      this.scrollToY(y);
    }
  }

  scrollToX = (x: number) => {
    if (this.board) return;

    setTimeout(() => {
      // $FlowFixMe
      const {scrollLeft} = this.board;
      if (Math.abs(scrollLeft - x) < SCROLL_SPEED) {
        // $FlowFixMe
        this.board.scrollLeft = x;
      } else {
        const newPos = scrollLeft < x
          ? scrollLeft + SCROLL_SPEED
          : scrollLeft - SCROLL_SPEED;
        // $FlowFixMe
        this.board.scrollLeft = newPos;
        this.scrollToX(x);
      }
    }, 10);
  }

  scrollToY = (y: number) => {
    if (!this.board) return;

    setTimeout(() => {
      // $FlowFixMe
      const {scrollTop} = this.board;
      if (Math.abs(scrollTop - y) < SCROLL_SPEED) {
        // $FlowFixMe
        this.board.scrollTop = y;
      } else {
        const newPos = scrollTop < y
          ? scrollTop + SCROLL_SPEED
          : scrollTop - SCROLL_SPEED;
        // $FlowFixMe
        this.board.scrollTop = newPos;
        this.scrollToY(y);
      }
    }, 10);
  }
}

export default Airflow;
