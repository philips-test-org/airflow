// @flow
// Utility functions for getting information from (primarily order) data.
import * as R from "ramda";

import {
  checkExamThenOrder,
} from "./utility";

import {
  unadjustedOrderStartTime,
} from "./data";

import type {
  Event,
  MergedOrder,
  Order,
  Resource,
} from "../types";


function getAppointmentTime(order: Order) {
  return R.pathOr(order.appointment, ["rad_exam", "rad_exam_time", "appointment"], order);
}

// Get the comments for an order.
function getOrderComments(order: Order): Array<Event> {
  return R.filter(({event_type}) => (event_type === "comment"), order.events);
}

function getOrderResourceId(order: Order) {
  const mergedResourceId = R.prop("resourceId", order);
  const adjustedLocation = R.pathOr(false, ["adjusted", "resource_id"], order);
  return mergedResourceId ? mergedResourceId :
    adjustedLocation ? adjustedLocation :
      checkExamThenOrder(order, ["resource", "id"]);
}

function getOrderResource(resources: Array<Resource>, order: Order) {
  const adjustedPath = R.path(["adjusted", "resource_id"]);
  const unadjustedPath = R.path(["rad_exam", "resource_id"]);

  const findAdjustedResource = R.find(R.propEq("id", adjustedPath(order)));
  const findUnadjustedResource = R.find(R.propEq("id", unadjustedPath(order)));

  return R.defaultTo(
    order.resource,
    R.defaultTo(findUnadjustedResource(resources), findAdjustedResource(resources))
  );
}

function getOrderStartTime(order: Order | MergedOrder) {
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
const getOrderingPhysician = (order: Order | MergedOrder) => {
  return R.defaultTo(
    R.path(["ordering_provider", "name"], order), 
    R.path(["rad_exam", "rad_exam_personnel", "ordering", "name"], order)
  )
};

const getPatientName = (order: Order | MergedOrder) => (
  order.merged ?
    order.patientName :
    R.path(["patient_mrn", "patient", "name"], order)
)

const getPatientMrn = (order: Order | MergedOrder) => (
  order.merged ?
    order.patientMrn :
    R.path(["patient_mrn", "mrn"], order)
)

const getPersonId = (order: Order | MergedOrder) => {
  return R.propEq("merged", true, order) ?
    R.path(["orders", 0, "patient_mrn", "patient_id"], order) :
    R.path(["patient_mrn", "patient_id"], order)
}

const getProcedure = (order: Order | MergedOrder): Array<Object> | string => (
  order.merged ?
    order.procedures :
    checkExamThenOrder(order, ["procedure", "description"])
)

function getPatientType(order: Order | MergedOrder) {
  return order.merged ?
    order.patientType :
    checkExamThenOrder(order, ["site_class", "patient_type", "patient_type"]);
}

function getScheduledDuration(order: Order | MergedOrder) {
  return checkExamThenOrder(order, ["procedure", "scheduled_duration"]);
}

export {
  getAppointmentTime,
  getOrderComments,
  getOrderResource,
  getOrderResourceId,
  getOrderStartTime,
  getOrderingPhysician,
  getPatientMrn,
  getPatientName,
  getPatientType,
  getPersonId,
  getProcedure,
  getScheduledDuration,
}
