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

export const PIXELS_PER_SECOND = 200.0 / 60.0 / 60.0;

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
  return startTime < startDate ? startDate : startTime;
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
