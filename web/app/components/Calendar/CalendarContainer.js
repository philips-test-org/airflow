// @flow
/*
   NOTE: This file was auto-generated for a component
   named "Calendar"; it is intended to be modified as
   needed to be useful.
*/

import {connect} from "react-redux";

import {ordersByResource} from "../../lib/utility";

import {
  fetchAvatar,
  fetchExams,
  showOrderModal,
  closeOrderModal,
} from "../../lib/actions";

import Calendar from "./Calendar";

import type {Order} from "../../types";

const mapStateToProps = (state: Object) => {
  return {
    focusedOrder: state.board.focusedOrder,
    orders: ordersByResource(state.board.orders),
    orderGroups: state.board.orderGroups,
    resources: state.board.resources,
    selectedResourceGroup: state.board.selectedResourceGroup,
    selectedResources: state.board.selectedResources,
    showModal: state.board.showModal,
    startDate: state.board.startDate,
    currentUser: state.user.currentUser,
    avatarMap: state.user.avatars,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
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

const CalendarContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Calendar);

export default CalendarContainer;
