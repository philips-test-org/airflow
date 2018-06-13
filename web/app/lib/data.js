// @flow
// Utility functions for calculating things based on (primarily order) data.

import * as R from "ramda";
import moment from "moment";

import {
  getOrderComments,
  getOrderResource,
  getScheduledDuration,
} from "./selectors";

import type {
  MergedOrder,
  Order,
  RadExam,
  Resource,
} from "../types";

// Find the start time for an exam
function examStartTime(exam: RadExam) {
  if (exam.rad_exam_time == undefined) { return null; }
  if (exam.rad_exam_time.begin_exam) {
    return exam.rad_exam_time.begin_exam;
  } else {
    return exam.rad_exam_time.appointment;
  }
}

function groupIdentity(resources: Array<Resource>, startDate: number, order: Order) {
  return order.patient_mrn_id + getOrderResource(resources, order).id + unadjustedOrderStartTime(order);
}

function hasComments(order: Order): boolean {
  return getOrderComments(order).length > 0
}

function orderStopTime(startDate: number, order: Order): number {
  const {adjusted} = order;
  if (!R.isNil(adjusted) && adjusted.start_time) {
    // adjusted start time plus the unadjusted duration
    return adjusted.start_time + orderDuration(startDate, order);
  }
  return unadjustedOrderStopTime(startDate, order);
}

// Returns milliseconds
function orderDuration(startDate: number, order: Order | MergedOrder): number {
  const unadjustedStartTime = unadjustedOrderStartTime(order) || 0;
  return unadjustedOrderStopTime(startDate, order) - unadjustedStartTime;
}

function unadjustedOrderStartTime(order: Order | MergedOrder): ?number {
  let startTime;
  if (order.merged) {
    startTime = order.startTime;
  } else {
    startTime = order.rad_exam ?
      examStartTime(order.rad_exam) :
      R.prop("appointment", order);
  }
  if (!startTime) {return null}
  return startTime;
}

function unadjustedOrderStopTime(startDate: number, order: Order | MergedOrder): number {
  if (order.merged) {
    return order.stopTime;
  } else if (!order.merged) {
    if (order.rad_exam && order.rad_exam.rad_exam_time.end_exam) {
      return order.rad_exam.rad_exam_time.end_exam;
    } else if (typeof(order.appointment_duration) === "number") {
      let durationMS = order.appointment_duration ? order.appointment_duration * 1000 : 0;
      return unadjustedOrderStartTime(order) + durationMS;
    }
  }
  const scheduledDuration = getScheduledDuration(order);
  return unadjustedOrderStartTime(order) + (scheduledDuration * 60 * 1000);
}

function wrapEvent(orderId: number | string, userId: number,
  eventType: string = "event", comments: ?string = null,
  newState: Object = {}) {
  return {
    id: null, //needs to become an internal id
    employee: userId,
    event_type: eventType,
    comments: comments,
    new_state: newState,
    created_at: moment().unix()*1000,
    order_id: orderId,
  }
}

export {
  examStartTime,
  groupIdentity,
  hasComments,
  orderDuration,
  orderStopTime,
  unadjustedOrderStartTime,
  unadjustedOrderStopTime,
  wrapEvent,
}
