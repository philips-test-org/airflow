// @flow
// Utility functions for working with data.
import * as R from "ramda";
import moment from "moment";

import {
  getOrderResourceId,
} from "./selectors";

import {
  STATUS_CHECKS,
} from "./constants";

import type {
  MergedOrder,
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
function checkExamThenOrder(order: Order | MergedOrder, pathArray: Array<string | number>) {
  const lens = R.lensPath(pathArray);
  return R.defaultTo(
    R.view(lens, order),
    R.view(lens, R.prop("rad_exam", order))
  );
}

function maybeMsToSeconds(duration: ?number): ?number {
  if (duration) {
    return duration / 1000;
  }
  return null;
}

function ordersByResource(orders: Array<Order>): {[string]: Array<Order>} {
  return R.groupBy(getOrderResourceId, orders)
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
  cardStatuses,
  checkExamThenOrder,
  formatName,
  formatTimestamp,
  kioskNumber,
  isIE,
  mapSelectedResources,
  maybeMsToSeconds,
  ordersByResource,
  printOrders,
  throttle,
}
