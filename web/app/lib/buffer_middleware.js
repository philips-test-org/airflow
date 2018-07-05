//@flow

import * as R from "ramda";
import moment from "moment";

import {
  getOrderStartTime,
} from "./selectors";

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
    id: attrs.id,
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

  const resourceIds = R.pluck("id", selectedResources);

  const mergedExams = R.reduce((acc, message) => {
    const {parentTable, parentId, attrs, table} = message;
    const lens = R.lensPath([parentId, "attrs"]);
    if (parentTable === "rad_exam") {
      return R.over(lens, R.merge({[table]: attrs}), acc);
    } else {
      return acc;
    }
  }, radExams, misc);

  const mergedOrders = R.reduce((acc, exam) => {
    const {parentTable, parentId, attrs} = exam;
    if (parentTable === "orders") {
      const lens = R.lensPath([parentId, "attrs"]);
      return R.over(lens, R.merge({"rad_exam": attrs}), acc);
    } else {
      return acc;
    }
  }, orders, R.values(mergedExams));

  R.forEach(({attrs, table}) => {
    const inResources = R.contains(R.path(["rad_exam", "resource_id"], attrs), resourceIds);
    const today = isToday(startDate, attrs);
    if (inResources && today) {
      store.dispatch(fetchExam(attrs.id, table));
    }
  }, R.values(mergedOrders));

  R.forEach(({attrs}) => {
    const inResources = R.contains(R.prop("resource_id", attrs), resourceIds);
    const today = isToday(startDate, attrs);
    if (inResources && today) {
      store.dispatch(fetchExam(attrs.id, "rad_exams"));
    }
  }, R.values(mergedExams));

  store.dispatch(resetBuffer());
}

function isToday(startDate, order) {
  const examstart = getOrderStartTime(order);
  return examstart == null || moment(examstart).startOf("day").unix()*1000 == startDate;
}

export default buffer;
