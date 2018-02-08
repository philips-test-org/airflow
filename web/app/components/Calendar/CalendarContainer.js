// @flow
/*
   NOTE: This file was auto-generated for a component
   named "Calendar"; it is intended to be modified as
   needed to be useful.
*/

import {connect} from 'react-redux';

import {ordersByResource} from "../../lib/utility";

import Calendar from './Calendar';

const mapStateToProps = (state: Object) => {
  return {
    startDate: state.board.startDate,
    orders: ordersByResource(state.board.orders),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fn: () => {
      dispatch();
    },
  }
};

const CalendarContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Calendar);

export default CalendarContainer;
