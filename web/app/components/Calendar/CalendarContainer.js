// @flow
import {connect} from "react-redux";
import * as R from "ramda";

import {ordersByResource} from "../../lib/utility";

import {
  adjustOrder,
  fetchAvatar,
  fetchExams,
  showOrderModal,
  closeOrderModal,
} from "../../lib/actions";

import Calendar from "./Calendar";

import type {Order} from "../../types";

const mapStateToProps = ({board, user}: Object) => {
  return {
    focusedOrder: R.find(R.propEq("id", board.focusedOrder), board.orders),
    orders: ordersByResource(board.orders),
    orderGroups: board.orderGroups,
    resources: board.resources,
    selectedResourceGroup: board.selectedResourceGroup,
    selectedResources: mapSelectedResources(board.selectedResources),
    showModal: board.showModal,
    startDate: board.startDate,
    currentUser: user.currentUser,
    avatarMap: user.avatars,
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
    fetchExams: (resources: Array<number>) => {
      dispatch(fetchExams(resources));
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

const CalendarContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Calendar);

export default CalendarContainer;
