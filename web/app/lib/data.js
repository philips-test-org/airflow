// @flow
import * as R from "ramda";
import moment from "moment";

import {
  orderResource,
} from "./utility";

import type {
  Order,
  RadExam,
  Resource,
} from "../types";

export function groupByIdentities(resources: Array<Resource>, startDate: number, orders: Array<Order>) {
  return R.groupBy((order) => groupIdentity(resources, startDate, order), orders);
}

export function groupIdentity(resources: Array<Resource>, startDate: number, order: Order) {
  return order.patient_mrn_id + orderResource(resources, order).id + unadjustedOrderStartTime(startDate, order);
}

// Find the start time for an exam
export function examStartTime(exam: RadExam) {
  if (exam.rad_exam_time == undefined) { return null; }
  if (exam.rad_exam_time.begin_exam) {
    return exam.rad_exam_time.begin_exam;
  } else {
    return exam.rad_exam_time.appointment;
  }
}

export function unadjustedOrderStartTime(startDate: number, order: Order): ?number {
  const startTime =
    order.rad_exam ?
      examStartTime(order.rad_exam) :
      order.appointment;
  if (!startTime) {return null}
  return startTime;
}

export function unadjustedOrderStopTime(startDate: number, order: Order): ?number {
  if (!R.isNil(order.rad_exam) && order.rad_exam.rad_exam_time.end_exam) {
    return order.rad_exam.rad_exam_time.end_exam;
  } else if (typeof(order.appointment_duration) === "number") {
    let durationMS = order.appointment_duration ? order.appointment_duration * 1000 : 0;
    return unadjustedOrderStartTime(startDate, order) + durationMS;
  } else if (!R.isNil(order.rad_exam)) {
    return unadjustedOrderStartTime(startDate, order) + (order.rad_exam.procedure.scheduled_duration * 60 * 1000);
  } else {
    return unadjustedOrderStartTime(startDate, order) + (order.procedure.scheduled_duration * 60 * 1000);
  }
}

// Returns milliseconds
export function orderDuration(startDate: number, order: Order): ?number {
  const unadjustedStartTime = unadjustedOrderStartTime(startDate, order) || 0;
  return unadjustedOrderStopTime(startDate, order) - unadjustedStartTime;
}

export function maybeMsToSeconds(duration: ?number): ?number {
  if (duration) {
    return duration / 1000;
  }
  return null;
}

export function wrapEvent(orderId: number, userId: number,
  eventType: string = "event", comments: ?string = null,
  newState: Object = {}) {
  return {
    id: null, //needs to become an internal id
    employee: userId,
    event_type: eventType,
    comments: comments,
    new_state: newState,
    created_at: moment().unix()*1000,
    order_id: orderId
  }
}
