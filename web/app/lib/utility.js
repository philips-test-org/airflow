// @flow
// Utility functions for working with data.
import * as R from "ramda";
import moment from "moment";

import type {
  Event,
  Order,
  Resource,
} from "../types";

// Remove "^" from name strings and rejoin comma separated.
const formatName = R.compose(R.join(", "), R.reject(R.isEmpty), R.split("^"));

const formatTimestamp = (epoch: ?(string | number)) => {
  if (!epoch) {return null}
  return moment(epoch).format("MMMM Do YYYY, HH:mm");
}

// Path array is an array of keys and/or array indices to follow
// to pull some data out of a compound object.
function checkExamThenOrder(order: Order, pathArray: Array<string | number>) {
  const lens = R.lensPath(pathArray);
  return R.defaultTo(
    R.view(lens, order),
    R.view(lens, order.rad_exam)
  );
}

// Get the comments for an order.
function orderComments(order: Order): Array<Event> {
  return R.filter(({event_type}) => (event_type === "comment"), order.events);
}

function ordersByResource(orders: Array<Order>): {[string]: Array<Order>} {
  return R.groupBy((order) => {
    const adjustedLocation = R.pathOr(false, ["adjusted", "resource_id"], order);
    return adjustedLocation ? adjustedLocation : checkExamThenOrder(order, ["resource", "id"]);
  }, orders)
}

function cardStatuses(order: Order, type: string, default_value: string = "") {
  const checks = [
    {
      name: "On Hold",
      order: 5,
      color: "#f5f52b",
      card_class: "highlight",
      check: (order) => (order.adjusted.onhold == true)
    },
    {
      name: "Cancelled",
      order: 6,
      color: "#c8040e",
      check: (order) => {
        let orderCancelled = order.current_status.universal_event_type == "cancelled";
        let undefinedExam = order.rad_exam != undefined;
        let examCancelled = order.rad_exam.current_status.universal_event_type.event_type == "cancelled";
        return (orderCancelled || (undefinedExam && examCancelled));
      }
    },
    {
      name: "Started",
      order: 3,
      color: "#631d76",
      check: (order) => {
        let hasExam = order.rad_exam != undefined;
        let hasBeginTime = order.rad_exam.rad_exam_time.begin_exam;
        let noEndTime = order.rad_exam.rad_exam_time.end_exam == null;
        return (hasExam && hasBeginTime && noEndTime);
      }
    },
    {
      name: "Completed",
      order: 4,
      color: "#005a8b",
      card_class: "completed",
      check: (order) => {
        let hasExam = order.rad_exam != undefined;
        let hasEndTime = order.rad_exam.rad_exam_time.end_exam !== null;
        return hasExam && hasEndTime;
      }
    },
    {
      name: "Patient Arrived",
      order: 2,
      color: "#1e9d8b",
      check: (order) => {
        let hasExam = order.rad_exam != undefined;
        let hasSignInTime = order.rad_exam.rad_exam_time.sign_in !== null;
        let hasCheckInTime = order.rad_exam.rad_exam_time.check_in !== null;
        return (hasExam && (hasSignInTime || hasCheckInTime));
      }
    },
    {
      name: "Ordered",
      order: 1,
      color: "#888888",
      check: (order) => {
        let noExam = order.rad_exam == undefined;
        let noSignInTime = R.isNil(order.rad_exam.rad_exam_time.sign_in);
        let noCheckInTime = R.isNil(order.rad_exam.rad_exam_time.check_in);
        return (noExam || noSignInTime || noCheckInTime);
      }
    }
  ]

  return R.reduce((acc, check) => {
    if (check.check(order)) {
      if (!R.isNil(type)) {
        return check[type];
      } else {
        return acc;
      }
    }
    return acc;
  }, default_value, R.sort(R.prop("order"), checks));
}

function orderResource(resources: Array<Resource>, order: Order) {
  return R.compose(
    R.defaultTo(order.resource),
    R.find((resource) => resource.id === order.adjusted.resource_id || resource.id === order.rad_exam.resource_id)
  )(resources)
}

function patientType(order: Order) {
  return checkExamThenOrder(order, ["site_class", "patient_type", "patient_type"]);
}

function appointmentTime(order: Order) {
  return R.pathOr(order.appointment, ["rad_exam", "rad_exam_time", "appointment"], order);
}

const kioskNumber = (orderId: number | string) => String(orderId).slice(-4);

export {
  appointmentTime,
  cardStatuses,
  checkExamThenOrder,
  formatName,
  formatTimestamp,
  kioskNumber,
  orderComments,
  orderResource,
  ordersByResource,
  patientType,
}
