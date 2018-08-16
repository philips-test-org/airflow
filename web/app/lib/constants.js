// @flow
// Misc. constants used throughout the app.
import * as R from "ramda";

import type {Order} from "../types";

//$FlowFixMe
export const APP_ROOT = harbingerjsRelativeRoot == "/" ? "" : harbingerjsRelativeRoot;

export const PIXELS_PER_SECOND = 200.0 / 60.0 / 60.0;

export const NAVBAR_OFFSET = 100;

// Notecard lane base column width.
export const COL_WIDTH = 250;

// Would be nice to define here and just use from
// this for the css (without having to use a style prop);
// would make it only require updating in one place.
// Instead, must be updated here and in css.
export const HOURBAR_WIDTH = 50;

export const SCROLL_SPEED = 100;

// Draggable Item types for React-DnD
export const ItemTypes = {
  NOTECARD: "notecard",
};

// Possible card statuses
type StatusCheck = {
  name: string,
  order: number,
  color: string,
  check: (order: Order) => boolean,
  card_class?: string,
};

export const STATUS_CHECKS: Array<StatusCheck> = [
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
    name: "PPCA Ready",
    order: 3,
    color: "#7AF3D2",
    card_class: "ppca_ready",
    check: (order: Order) => (order.adjusted.ppca_ready == true),
  },
  {
    name: "Started",
    order: 4,
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
    order: 5,
    color: "#005a8b",
    card_class: "completed",
    check: (order: Order) => {
      let hasExam = order.rad_exam != undefined;
      let hasEndTime = !R.isNil(R.path(["rad_exam", "rad_exam_time", "end_exam"], order));
      return hasExam && hasEndTime;
    },
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
