// @flow
import {connect} from "react-redux";
import * as R from "ramda";

import {ordersByResource} from "../../lib/utility";

import {
  adjustOrder,
  fetchAvatar,
  fetchExams,
  fetchKioskExams,
  showOrderModal,
  closeOrderModal,
} from "../../lib/actions";

import Airflow from "./Airflow";

import type {Order} from "../../types";

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
    startDate: board.startDate,
    type: board.type,
    loading: board.loading,
    images: board.images,
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
    fetchExams: (resources: Array<number>, date: number) => {
      dispatch(fetchExams(resources, date));
    },
    fetchKioskExams: (resources: Array<number>) => {
      dispatch(fetchKioskExams(resources));
    },
    openModal: (order: Order) => {
      dispatch(showOrderModal(order));
    },
    closeModal: () => {
      dispatch(closeOrderModal());
    }
  }
};

const mapSelectedResources = R.compose(
  R.mergeAll,
  R.map(({id, name}) => ({[id]: name}))
)

const AirflowContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Airflow);

export default AirflowContainer;
