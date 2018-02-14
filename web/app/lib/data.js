// @flow
import * as R from "ramda";

import {
  orderResource,
} from "./utility";

import type {
  Order,
  Resource,
} from "../types";

export function groupByIdentities(resources: Array<Resource>, startDate: number, orders: Array<Order>) {
  return R.groupBy((order) => groupIdentity(resources, startDate, order), orders);
}

export function groupIdentity(resources: Array<Resource>, startDate: number, order: Order) {
  return order.patient_mrn_id + orderResource(resources, order).id + unadjustedOrderStartTime(startDate, order);
}

  // Find the start time for an exam
export function examStartTime(exam) {
  if (exam.rad_exam_time == undefined) { return null; }
  if (exam.rad_exam_time.begin_exam) {
    return exam.rad_exam_time.begin_exam;
  } else {
    return exam.rad_exam_time.appointment;
  }
}


export function unadjustedOrderStartTime(startDate, order) {
  var startTime;
  if (order.rad_exam) {
    startTime = examStartTime(order.rad_exam)
  } else {
    startTime = order.appointment;
  }
  return startTime < startDate ? startDate : startTime;
}
