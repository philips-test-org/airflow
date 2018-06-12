// @flow
import * as R from "ramda";
import moment from "moment";

import {
  checkExamThenOrder,
  orderResource,
} from "./utility";

import type {
  MergedOrder,
  Order,
  RadExam,
  Resource,
} from "../types";

export function groupByIdentities(resources: Array<Resource>, startDate: number, orders: Array<Order>) {
  return R.groupBy((order) => groupIdentity(resources, startDate, order), orders);
}

export function groupIdentity(resources: Array<Resource>, startDate: number, order: Order) {
  return order.patient_mrn_id + orderResource(resources, order).id + unadjustedOrderStartTime(order);
}

export function getOrderStartTime(order: Order | MergedOrder) {
  if (order.merged) {
    return order.startTime;
  } else {
    const hasStartTime = R.path(["adjusted", "start_time"], order);
    const startTime = hasStartTime ? order.adjusted.start_time :
      unadjustedOrderStartTime(order);
    if (!startTime) return 0;
    return startTime;

  }
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

export function unadjustedOrderStartTime(order: Order | MergedOrder): ?number {
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

export function orderStopTime(startDate: number, order: Order): number {
  const {adjusted} = order;
  if (!R.isNil(adjusted) && adjusted.start_time) {
    // adjusted start time plus the unadjusted duration
    return adjusted.start_time + orderDuration(startDate, order);
  }
  return unadjustedOrderStopTime(startDate, order);
}

export function unadjustedOrderStopTime(startDate: number, order: Order | MergedOrder): number {
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
  const scheduledDuration = checkExamThenOrder(order, ["procedure", "scheduled_duration"]);
  return unadjustedOrderStartTime(order) + (scheduledDuration * 60 * 1000);
}

// Returns milliseconds
export function orderDuration(startDate: number, order: Order | MergedOrder): number {
  const unadjustedStartTime = unadjustedOrderStartTime(order) || 0;
  return unadjustedOrderStopTime(startDate, order) - unadjustedStartTime;
}

export function maybeMsToSeconds(duration: ?number): ?number {
  if (duration) {
    return duration / 1000;
  }
  return null;
}

export function wrapEvent(orderId: number | string, userId: number,
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
