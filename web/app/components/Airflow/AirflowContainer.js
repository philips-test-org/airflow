// @flow
import {connect} from "react-redux";
import * as R from "ramda";
import moment from "moment";

import {
  ordersByResource,
  mapSelectedResources,
} from "../../lib/utility";

import {
  adjustOrder,
  fetchAvatar,
  fetchExams,
  fetchKioskExams,
  fetchInitialApp,
  fetchCurrentEmployee,
  showOrderModal,
  closeOrderModal,
  redirectToSSO,
  updateBrowserHistory,
  updateDate,
  updateViewType,
  updateWidth,
  updateSelectedResourceGroup,
} from "../../lib/actions";

import Airflow from "./Airflow";

import type {
  Order,
  Resource,
  ViewType,
} from "../../types";

const mapStateToProps = ({board, user}: Object) => {
  return {
    avatarMap: user.avatars,
    currentUser: user.currentUser,
    focusedOrder: R.find(R.propEq("id", board.focusedOrder), board.orders),
    orderGroups: board.orderGroups,
    orders: ordersByResource(board.orders),
    ordersLoaded: !R.isEmpty(board.orders),
    resources: board.resources,
    selectedResourceGroup: board.selectedResourceGroup,
    selectedResources: mapSelectedResources(board.selectedResources),
    showModal: board.showModal,
    ssoUrl: user.ssoUrl,
    startDate: board.startDate,
    type: board.type,
    loading: board.loading,
    images: board.images,
    boardWidth: board.width,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    adjustOrder: (event: Object) => {
      dispatch(adjustOrder(event));
    },
    fetchAvatar: (userId: number) => {
      dispatch(fetchAvatar(userId));
    },
    fetchExams: (selectedResourceGroup: string, resources: Array<number>, date: number) => {
      dispatch(fetchExams(selectedResourceGroup, resources, date));
    },
    fetchKioskExams: (selectedResourceGroup: string, resources: Array<number>) => {
      dispatch(fetchKioskExams(selectedResourceGroup, resources));
    },
    fetchInitialApp: (type: ViewType, date: number) => {
      dispatch(fetchInitialApp(type, date));
    },
    fetchCurrentEmployee: () => {
      dispatch(fetchCurrentEmployee());
    },
    openModal: (order: Order) => {
      dispatch(showOrderModal(order));
    },
    closeModal: () => {
      dispatch(closeOrderModal());
    },
    redirectToSSO: (ssoUrl: string, viewType: ViewType) => {
      dispatch(redirectToSSO(ssoUrl, viewType));
    },
    updateBrowserHistory: (state: {viewType: ViewType}, title: string, path: string) => {
      dispatch(updateBrowserHistory(state, title, path));
    },
    updateDate: (date: moment) => {
      dispatch(updateDate(date));
    },
    updateViewType: (updatedView: ViewType) => {
      dispatch(updateViewType(updatedView));
    },
    updateWidth: (updatedWidth: number) => {
      dispatch(updateWidth(updatedWidth));
    },
    updateSelectedResourceGroup: (resources: {[string]: Array<Resource>}, selectedResourceGroup: string) => {
      dispatch(updateSelectedResourceGroup(resources, selectedResourceGroup));
    },
  }
};

const AirflowContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Airflow);

export default AirflowContainer;
