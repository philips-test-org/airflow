// @flow
// Utility functions for working with data.
import * as R from "ramda";

import type {
  Event,
  Order,
} from "../types";

// Remove "^" from name strings and rejoin comma separated.
const formatName = R.compose(R.join(", "), R.reject(R.isEmpty), R.split("^"));

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
  return R.groupBy((order) => checkExamThenOrder(order, ["resource", "name"]), orders);
}

export {
  checkExamThenOrder,
  formatName,
  orderComments,
  ordersByResource,
}
