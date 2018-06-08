// @flow
// Utility functions for working with data.
import * as R from "ramda";
import moment from "moment";

import type {
  Event,
  MergedOrder,
  Order,
  Resource,
} from "../types";

// Remove "^" from name strings and rejoin comma separated.
const formatName = R.compose(R.join(", "), R.reject(R.isEmpty), R.split("^"));

export const STATUS_CHECKS = [
  {
    name: "Ordered",
    order: 1,
    color: "#888888",
    check: (order: Order) => {
      let noExam = order.rad_exam == undefined;
      let noSignInTime = R.isNil(R.path(["rad_exam", "rad_exam_time", "sign_in"], order));
      let noCheckInTime = R.isNil(R.path(["rad_exam", "rad_exam_time", "check_in"], order));
      return (noExam || noSignInTime || noCheckInTime);
    },
  },
  {
    name: "Patient Arrived",
    order: 2,
    color: "#1e9d8b",
    check: (order: Order) => {
      let hasExam = order.rad_exam != undefined;
      let hasSignInTime = !R.isNil(R.path(["rad_exam", "rad_exam_time", "sign_in"], order));
      let hasCheckInTime = !R.isNil(R.path(["rad_exam", "rad_exam_time", "check_in"], order));
      return (hasExam && (hasSignInTime || hasCheckInTime));
    },
  },
  {
    name: "Started",
    order: 3,
    color: "#631d76",
    check: (order: Order) => {
      let hasExam = order.rad_exam != undefined;
      let hasBeginTime = !R.isNil(R.path(["rad_exam", "rad_exam_time", "begin_exam"], order));
      let noEndTime = R.isNil(R.path(["rad_exam", "rad_exam_time", "end_exam"], order));
      return (hasExam && hasBeginTime && noEndTime);
    },
  },
  {
    name: "Completed",
    order: 4,
    color: "#005a8b",
    card_class: "completed",
    check: (order: Order) => {
      let hasExam = order.rad_exam != undefined;
      let hasEndTime = !R.isNil(R.path(["rad_exam", "rad_exam_time", "end_exam"], order));
      return hasExam && hasEndTime;
    },
  },
  {
    name: "PPCA Ready",
    order: 5,
    color: "#7AF3D2",
    card_class: "ppca_ready",
    check: (order: Order) => (order.adjusted.ppca_ready == true),
  },
  {
    name: "On Hold",
    order: 6,
    color: "#f5f52b",
    card_class: "highlight",
    check: (order: Order) => (order.adjusted.onhold == true),
  },
  {
    name: "Cancelled",
    order: 7,
    color: "#c8040e",
    check: (order: Order) => {
      let orderCancelled = R.path(["current_status", "universal_event_type", "event_type"], order) == "cancelled";
      let undefinedExam = order.rad_exam != undefined;
      let examCancelled = R.path(["rad_exam", "current_status", "universal_event_type", "event_type"], order) == "cancelled";
      return (orderCancelled || (undefinedExam && examCancelled));
    },
  },
]

const formatTimestamp = (epoch: ?(string | number)) => {
  if (!epoch) {return null}
  return moment(epoch).format("MMMM Do YYYY, HH:mm");
}

// Path array is an array of keys and/or array indices to follow
// to pull some data out of a compound object.
function checkExamThenOrder(order: Order | MergedOrder, pathArray: Array<string | number>) {
  const lens = R.lensPath(pathArray);
  return R.defaultTo(
    R.view(lens, order),
    R.view(lens, R.prop("rad_exam", order))
  );
}

// Get the comments for an order.
function orderComments(order: Order): Array<Event> {
  return R.filter(({event_type}) => (event_type === "comment"), order.events);
}

function hasComments(order: Order): boolean {
  return orderComments(order).length > 0
}

function ordersByResource(orders: Array<Order>): {[string]: Array<Order>} {
  return R.groupBy(getOrderResource, orders)
}

const getOrderResource = (order: Order) => {
  const mergedResourceId = R.prop("resourceId", order);
  const adjustedLocation = R.pathOr(false, ["adjusted", "resource_id"], order);
  return mergedResourceId ? mergedResourceId :
    adjustedLocation ? adjustedLocation :
      checkExamThenOrder(order, ["resource", "id"]);
}

function cardStatuses(order: Order | MergedOrder, keys: Array<string>, default_value: Object = {}) {
  return R.reduce((acc, check) => {
    if (check.check(order)) {
      if (!R.isNil(keys)) {
        return R.pick(keys, check);
      } else {
        return acc;
      }
    }
    return acc;
  }, default_value, R.sortBy(R.prop("order"), STATUS_CHECKS));
}

function orderResourceId(order: Order) {
  return R.defaultTo(
    R.path(["rad_exam", "resource_id"], order),
    R.path(["adjusted", "resource_id"], order),
  )
}

function orderResource(resources: Array<Resource>, order: Order) {
  return R.compose(
    R.defaultTo(order.resource),
    R.find((resource) =>
      resource.id === R.path(["adjusted", "resource_id"], order) ||
    resource.id === R.path(["rad_exam", "resource_id"], order)
    )
  )(resources)
}

function getPatientType(order: Order | MergedOrder) {
  return order.merged ?
    order.patientType :
    checkExamThenOrder(order, ["site_class", "patient_type", "patient_type"]);
}

function appointmentTime(order: Order) {
  return R.pathOr(order.appointment, ["rad_exam", "rad_exam_time", "appointment"], order);
}

const kioskNumber = (orderId: number | string) => String(orderId).slice(-4);

const mapSelectedResources = (resources: Array<Resource>) => {
  if (!resources || R.length(resources) <= 0) return {};
  return R.compose(
    R.mergeAll,
    R.map(({id, name}) => ({[id]: name}))
  )(resources);
}

function isIE(): (?number) {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf("msie") !== -1) ? parseInt(myNav.split("msie")[1]) : null;
}

function printOrders() {
  var content = document.getElementById("print-view-contents");
  // Iframe
  var frame: any = document.getElementById("print-view-frame");
  if (content && frame) {
    const pri = frame.contentWindow;
    pri.document.open();
    pri.document.write(content.innerHTML);
    pri.document.close();
    pri.focus();
    pri.print();
  }
}

const orderingPhysician = (order: Order) => R.defaultTo(
  "unknown",
  R.path(["rad_exam", "rad_exam_personnel", "ordering", "name"], order),
);

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

const getProcedure = (order: Order | MergedOrder) => (
  order.merged ?
    order.procedures :
    checkExamThenOrder(order, ["procedure", "description"])
)

const throttle = (func: Function, limit: number) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export {
  appointmentTime,
  cardStatuses,
  checkExamThenOrder,
  formatName,
  formatTimestamp,
  kioskNumber,
  hasComments,
  isIE,
  mapSelectedResources,
  orderComments,
  orderResourceId,
  orderResource,
  ordersByResource,
  orderingPhysician,
  getOrderResource,
  getPatientMrn,
  getPatientName,
  getPatientType,
  getPersonId,
  getProcedure,
  printOrders,
  throttle,
}
