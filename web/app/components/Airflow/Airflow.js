// @flow
/* global module */
import React, {Component} from "react";
import * as R from "ramda";
import moment from "moment";
import key from "keymaster";
import {hot} from "react-hot-loader";

import Calendar from "../Calendar";
import Overview from "../Overview";
import OrderModal from "../OrderModal";
import ViewControls from "../ViewControls";
import ErrorBoundary from "../ErrorBoundary";
import Notifications from "../Notifications";
import {withTranslation} from "react-i18next";

import {
  APP_ROOT,
  COL_WIDTH,
  HOURBAR_WIDTH,
  NAVBAR_OFFSET,
  SCROLL_SPEED,
  getPersonId,
  isIE,
  printOrders,
  throttle,
} from "../../lib";

import {
  sortedSelectedResourceIds,
} from "../../lib/utility"

import type {
  Event,
  Images,
  Notification,
  Order,
  RadExam,
  Resource,
  User,
  ViewType,
} from "../../types";

type Props = {
  adjustOrder: (event: Object) => void,
  connectAPM: () => void,
  avatarMap: {[number]: Blob},
  boardWidth: number,
  closeModal: () => void,
  currentUser: User,
  examsByPerson: {[number]: Array<RadExam>},
  fetchAvatar: (userId: number) => void,
  fetchCurrentEmployee: () => void,
  fetchExams: (selectedResourceGroup: string, resourceIds: Array<number>, date?: number) => void,
  fetchInitialApp: (type: ViewType, date?: number) => void,
  fetchKioskExams: (selectedResourceGroup: string, resourceIds: Array<number>, date?: number) => void,
  fetchPersonExams: (personId: number) => void,
  fetchPersonEvents: (mrnId: number) => void,
  focusedOrder: Order,
  images: Images,
  loading: boolean,
  markNotificationDisplayed: (id: number | string) => void,
  notifications: Array<Notification>,
  openModal: (id: string | number) => void,
  orderGroups: {[string]: Array<Order>},
  orders: {[string]: Array<Order>},
  ordersLoaded: boolean,
  personEvents?: Array<Event>,
  redirectToSSO: (ssoUrl: string, destination: ViewType) => void,
  removeOrders: (orderIds: Array<number>) => void,
  resources: {[string]: Array<Resource>},
  selectedResourceGroup: string,
  selectedResources: {[number]: string},
  showModal: boolean,
  ssoUrl: string,
  startDate: number,
  type: ViewType,
  updateBrowserHistory: (state: {viewType: ViewType}, title: string, path: string) => void,
  updateDate: (date: moment) => void,
  updateSelectedResourceGroup: (resources: {[string]: Array<Resource>}, selectedResourceGroup: string) => void,
  updateViewType: (updatedView: ViewType) => void,
  updateWidth: (updatedWidth: number) => void,
  updateWidthMultiplier: (resourceId: number, widthMultiplier: number) => void,
  widthMultipliers: {[number]: number},
  t:(label: string) =>string
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
    this.props.connectAPM();
    // $FlowFixMe
    if (!isIE() || isIE() > 9) {
      this.setupViewChangeHandlers();
    }

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
      this.updateActiveLink(viewType);

      if (R.includes("kiosk", [viewType, this.props.type])) {
        this.fetchExams(viewType);
      }
    };

    key("⌘+p, ctrl+p", (event, _handler) => {
      event.preventDefault();
      const resourceIds = R.keys(this.props.selectedResources);
      const date = this.props.startDate;
      printOrders(date, resourceIds, this.props.selectedResourceGroup);
    });

    key("esc, escape", (_event, _handler) => {
      if (this.props.showModal) {
        this.props.closeModal()
      }
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
      } else if (R.includes("kiosk", [oldType, newType])) {
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
      <div className={this.props.type === "overview" ? "overview" : ""}>
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
            selectedResources={this.props.selectedResources}
          />
        </ErrorBoundary>
        {this.props.loading
          ? <img className="spinner" src={this.props.images.spinner} />
          : this.renderBoard()}
      </div>
    );
  }

  renderNoResourcesMessage() {
    return (
      <div className="container-fluid alerts">
        <div className="alert alert-danger">{this.props.t('MESSAGE_ATLEASTONERESOURCE')}</div>
      </div>
    );
  }

  renderBoard() {
    if (R.keys(this.props.selectedResources).length <= 0) {
      return this.renderNoResourcesMessage();
    }

    const BodyComponent = this.props.type === "overview" ? Overview : Calendar;
    const translateX = Math.abs(this.state.gridPosition.x);
    const tdStyle = {
      transform: `translateX(${translateX}px)`,
      msTransform: `translateX(${translateX}px)`,
    };
    const thStyle = {
      position: "relative",
      transform: `translate(${translateX}px, ${this.headerOffset()}px)`,
      msTransform: `translate(${translateX}px, ${this.headerOffset()}px)`,
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
      <div>
        {this.props.type !== "overview" && this.renderHeadings(translateX)}
        <div
          id="board"
          onScroll={throttle(this.updateScrollPosition, 100)}
          ref={el => {if (el) this.board = el}}
          onClick={this.handleBoardClick}
        >
          <BodyComponent
            style={scrollStyle}
            headerOffset={this.headerOffset()}
            boardWidth={this.props.boardWidth}
            gridPosition={this.state.gridPosition}
            filteredOrderIds={this.state.filteredOrderIds}
            focusedOrderId={this.state.focusedOrderId}
            updateWidthMultiplier={this.props.updateWidthMultiplier}
            scrollToTop={this.scrollToTop}
            scrollToCoordinates={this.scrollToCoordinates}
            {...this.props}
            updateWidth={throttledWidthUpdate}
            openModal={this.openModal}
          />
          {this.renderOrderModal()}
          <Notifications
            notifications={this.props.notifications}
            markNotificationDisplayed={this.props.markNotificationDisplayed}
          />
        </div>
      </div>
    );
  }

  renderHeadings(translateX: number) {
    return (
      <div id="board-headings">
        <div id="white-spacer">&nbsp;</div>
        <table id="time-headings" style={{left: HOURBAR_WIDTH - translateX}}>
          <tbody>
            <tr className="heading">
              {sortedSelectedResourceIds(this.props.selectedResources).map(this.renderHeading)}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  renderHeading = (resourceId: number, index: number) => {
    const resourceName = this.props.selectedResources[resourceId];
    const widthMultiplier = this.props.widthMultipliers[resourceId] || 1;
    const minWidth = (COL_WIDTH * widthMultiplier)
      - (index === 0 ? 1 : 0)
      + (widthMultiplier > 1 ? 0 : 1);
    const style = {minWidth};
    return (
      <td key={`${resourceId}-heading`} style={style}>
        <h1 className="header-spacer">{resourceName}</h1>
      </td>
    )
  }

  renderOrderModal() {
    if (!this.props.showModal || !this.props.focusedOrder || !this.props.orderGroups) {
      return null;
    }
    const exams = this.props.examsByPerson[
      getPersonId(this.props.focusedOrder)
    ];
    return (
      <OrderModal
        adjustOrder={this.props.adjustOrder}
        avatarMap={this.props.avatarMap}
        closeModal={this.props.closeModal}
        currentUser={this.props.currentUser}
        exams={exams}
        fetchAvatar={this.props.fetchAvatar}
        fetchPersonEvents={this.props.fetchPersonEvents}
        order={this.props.focusedOrder}
        orderGroup={this.orderGroup(this.props.focusedOrder)}
        personEvents={this.props.personEvents}
        resourceMap={this.props.selectedResources}
        startDate={this.props.startDate}
      />
    )
  }

  openModal = (order: Order) => {
    this.props.openModal(order.id);
    this.props.fetchPersonExams(getPersonId(order));
  }

  headerOffset = () => {
    if (this.state.gridPosition.y === 0) {return 0}
    return R.max(0, NAVBAR_OFFSET + R.negate(this.state.gridPosition.y));
  }

  orderGroup(order: Order) {
    return this.props.orderGroups[order.groupIdentity]
  }

  updateScrollPosition = (event: SyntheticUIEvent<>) => {
    //prevents gridPosition from updating when card modal is opened.
    if(this.props.showModal) return;
    const t = R.pathOr(null, ["currentTarget", "firstChild"], event);
    const bounding = t.getBoundingClientRect();
    const position = {x: bounding.left, y: bounding.top};
    this.setState({gridPosition: position});
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
    this.kioskLink = document.querySelector(".menu-item[href$='kiosk']")
    if (this.kioskLink) {
      this.kioskLink.addEventListener("click",
        (e: MouseEvent) => {this.viewClickHandler(e, "kiosk", `${APP_ROOT}/kiosk`)}
      )
    }

    this.calendarLink = document.querySelector(".menu-item[href$='calender']")
    if (this.calendarLink) {
      this.calendarLink.addEventListener("click",
        (e: MouseEvent) => {this.viewClickHandler(e, "calendar", `${APP_ROOT}/main/calendar`)}
      )
    }

     this.overviewLink = document.querySelector(".menu-item[href$='overview']")
    if (this.overviewLink) {
      this.overviewLink.addEventListener("click",
        (e: MouseEvent) => {this.viewClickHandler(e, "overview", `${APP_ROOT}/main/overview`)}
      )
    }
  }

  viewClickHandler = (e: MouseEvent, type: ViewType, path: string) => {
    e.preventDefault();

    const {updateBrowserHistory, updateViewType} = this.props;

    updateViewType(type);
    updateBrowserHistory({viewType: this.props.type}, type, path);
    this.updateActiveLink(this.props.type);
  }

  updateActiveLink(viewType: ViewType) {
    if (this.kioskLink && this.calendarLink && this.overviewLink) {
      switch (viewType) {
        case "kiosk":
          this.kioskLink.className = "item menu-item active";
          this.calendarLink.className = "item menu-item";
          this.overviewLink.className = "item menu-item";
          break;
        case "calendar":
          this.kioskLink.className = "item menu-item";
          this.calendarLink.className = "item menu-item active";
          this.overviewLink.className = "item menu-item";
          break;
        case "overview":
          this.calendarLink.className = "item menu-item";
          this.kioskLink.className = "item menu-item";
          this.overviewLink.className = "item menu-item active";
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

  handleBoardClick = (event: SyntheticEvent<>) => {
    const target = event.target;
    if (this.props.showModal) {
      // If the click is on the transparent modal padding, id will be order-modal,
      // if the click is elsewhere in the modal, it won't be.
      if (target && R.prop("id", target) == "order-modal") {
        this.props.closeModal();
      }
    }
  }

  scrollToTop = () => {
    if (!this.board) return;
    this.board.scrollLeft = 0;
    this.board.scrollTop = 0;

  }

  scrollToCoordinates = (x: number, y: number) => {
    if (this.board) {
      this.scrollToX(x);
      this.scrollToY(y);
    }
  }

  scrollToX = (x: number, lastX: ?number) => {
    if (!this.board) return;

    setTimeout(() => {
      // $FlowFixMe
      const {scrollLeft} = this.board;
      if (lastX === scrollLeft) return;

      if (Math.abs(scrollLeft - x) < SCROLL_SPEED) {
        // $FlowFixMe
        this.board.scrollLeft = x;
      } else {
        const newPos = scrollLeft < x
          ? scrollLeft + SCROLL_SPEED
          : scrollLeft - SCROLL_SPEED;
        // $FlowFixMe
        this.board.scrollLeft = newPos;
        this.scrollToX(x, scrollLeft);
      }
    }, 10);
  }

  scrollToY = (y: number, lastY: ?number) => {
    if (!this.board) return;

    setTimeout(() => {
      // $FlowFixMe
      const {scrollTop} = this.board;
      if (lastY === scrollTop) return;

      if (Math.abs(scrollTop - y) < SCROLL_SPEED) {
        // $FlowFixMe
        this.board.scrollTop = y;
      } else {
        const newPos = scrollTop < y
          ? scrollTop + SCROLL_SPEED
          : scrollTop - SCROLL_SPEED;
        // $FlowFixMe
        this.board.scrollTop = newPos;
        this.scrollToY(y, scrollTop);
      }
    }, 10);
  }
}

export default hot(module)(withTranslation()(Airflow));