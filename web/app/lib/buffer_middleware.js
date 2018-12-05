//@flow

import * as R from "ramda";
import moment from "moment";

import {
  getOrderStartTime,
} from "./selectors";

import {
  examStartTime,
} from "./data";

import {
  BufferActions,
  fetchExam,
  bufferMessage,
  resetBuffer,
} from "./actions";

const {
  BUFFER_ENQUEUE,
  FLUSH_BUFFER,
} = BufferActions;

const buffer = (store: Object) => (next: Function) => (action: Object) => {
  switch (action.type)  {
    case BUFFER_ENQUEUE: return processPayload(store, action);
    case FLUSH_BUFFER: return flushBuffer(store, action);
    default: return next(action);
  }
};

const processPayload = (store, action) => {
  const {employeeId, payload} = action;
  const {pre, post} = R.prop("pre_and_post", payload);
  const attrs = R.isNil(post) ? pre : post;
  let table = action.table;
  let parentTable;
  let parentId;

  if (table == "rad_exams") {
    table = "radExams";
    parentTable = "orders";
    parentId = attrs.order_id;
  } else if (table !== "orders") {
    table = table == "rad_exam_times" ? "rad_exam_time" : table;
    parentTable = "rad_exam";
    parentId = attrs.rad_exam_id;
  }

  store.dispatch(bufferMessage(table, {
    id: payload.affected_row_id,
    employeeId,
    parentTable,
    parentId,
    attrs,
    table,
  }));
};

function flushBuffer(store, _action) {
  const state = store.getState();
  const {orders, radExams, misc} = state.buffer;
  const {startDate, selectedResources} = state.board;
  const startEpoch = epochTime(startDate);
  const resourceIds = R.pluck("id", selectedResources);

  // Merge rad exam associated messages into rad exams.
  const mergedExams = R.reduce((acc, message) => {
    const {parentTable, parentId, attrs, table} = message;
    const lens = R.lensPath([parentId, "attrs"]);
    if (parentTable === "rad_exam") {
      return R.over(lens, R.mergeRight({[table]: attrs}), acc);
    } else {
      return acc;
    }
  }, radExams, misc);

  // Exams that don't have a buffered order message.
  var unmergedExams = [];
  // Merge rad exams into orders.
  const mergedOrders = R.reduce((acc, exam) => {
    const {parentTable, parentId, attrs} = exam;
    const lens = R.lensPath([parentId, "attrs"]);
    if (parentTable === "orders" && R.view(lens, acc)) {
      return R.over(lens, R.mergeRight({"rad_exam": attrs}), acc);
    } else {
      unmergedExams = R.append(exam, unmergedExams);
      return acc;
    }
  }, orders, R.values(mergedExams));

  // Fetch each order that is for current day and selected resource group.
  R.forEach(({attrs, table}) => {
    const inResources = R.contains(R.path(["rad_exam", "resource_id"], attrs), resourceIds);
    const today = isToday(startEpoch, attrs);
    if (inResources && today) {
      store.dispatch(fetchExam(attrs.id, table));
    }
  }, R.values(mergedOrders));

  // Fetch each rad exam that is for current day and selected resource group.
  R.forEach(({attrs}) => {
    const inResources = R.contains(R.prop("resource_id", attrs), resourceIds);
    const today = isToday(startEpoch, attrs);
    if (inResources && today) {
      store.dispatch(fetchExam(attrs.id, "rad_exams"));
    }
  }, unmergedExams);

  store.dispatch(resetBuffer());
}

function isToday(startEpoch, order) {
  const examstart = R.has("rad_exam", order) ? getOrderStartTime(order) : examStartTime(order);
  return examstart == null || epochTime(examstart) == startEpoch;
}

function epochTime(time) {
  return moment(time).startOf("day").unix() * 1000;
}

export default buffer;
