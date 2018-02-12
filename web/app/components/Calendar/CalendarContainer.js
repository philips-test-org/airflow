// @flow
/*
   NOTE: This file was auto-generated for a component
   named "Calendar"; it is intended to be modified as
   needed to be useful.
*/

import {connect} from 'react-redux';

import {ordersByResource} from "../../lib/utility";

import {fetchExams} from "../../lib/actions";

import Calendar from './Calendar';

const mapStateToProps = (state: Object) => {
  return {
    startDate: state.board.startDate,
    orders: ordersByResource(state.board.orders),
    resources: state.board.resources,
    selectedResource: state.board.selectedResource,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchExams: (resources: Array<number>) => {
      dispatch(fetchExams(resources));
    },
  }
};

const CalendarContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Calendar);

export default CalendarContainer;
