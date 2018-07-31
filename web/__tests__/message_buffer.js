import {forEach, lensPath, set} from "ramda";
import moment from "moment";

import fetchMock from "fetch-mock";

import storeFunc from "../app/lib/store";

import {
  bufferEnqueue,
  flushBuffer,
  updateDate,
  updateSelectedResourceGroup,
} from "../app/lib/actions";

import {flushAllPromises} from "./helpers";

import order from "./mockState/messages/auditMessages/order";
import radExam from "./mockState/messages/auditMessages/radExam";
import radExamTime from "./mockState/messages/auditMessages/radExamTime";
import radExamTime2 from "./mockState/messages/auditMessages/radExamTime_2";
import radExamPersonnel from "./mockState/messages/auditMessages/radExamPersonnel";
import order_799888 from "./mockState/messages/auditMessages/order_799888";

describe("Buffer middleware", () => {
  let store;
  let resources;
  let selectedResourceGroup;

  beforeEach(() => {
    store = storeFunc();
    resources = {
      "Group": [
        {id: 5},
      ],
      "NotAGroup": [
        {id: 0},
      ],
    };
    selectedResourceGroup = "Group";
  });

  function dispatchMessage(store, message) {
    const {routing_key, payload} = message;
    const tokens = routing_key.split(".");
    const table = tokens[0];
    const affected_id = tokens[2];
    store.dispatch(bufferEnqueue(table, affected_id, payload));
  }

  it("accumulates state for incoming audit messages", () => {
    expect(store.getState().buffer).toEqual({orders: {}, radExams: {}, misc: []});
    const messages = [order, radExam, radExamTime, radExamPersonnel, radExamTime2];

    store.dispatch(updateSelectedResourceGroup(resources, selectedResourceGroup));

    forEach((message) => {dispatchMessage(store, message)}, messages);

    expect(Object.keys(store.getState().buffer.orders)).toContain(`${order.payload.affected_row_id}`);
    expect(Object.keys(store.getState().buffer.radExams)).toContain(`${radExam.payload.affected_row_id}`);
    expect(store.getState().buffer.misc).toHaveLength(3);
  });

  it("fetches an exam if it occurs today in the selected resource group", async () => {
    fetchMock.restore();
    fetchMock.get("/exams/799946?table=orders", [order_799888]);

    expect(store.getState().board.orders).toHaveLength(0);
    expect(store.getState().buffer).toEqual({orders: {}, radExams: {}, misc: []});

    store.dispatch(updateSelectedResourceGroup(resources, selectedResourceGroup));

    const pastDate = moment().add(-10, "days");
    // Modify the order start time to equal pastDate.
    const beginExamLens = lensPath(["payload", "pre_and_post", "pre", "begin_exam"]);
    const timeMessage = set(beginExamLens, pastDate, radExamTime);
    const timeMessage2 = set(beginExamLens, pastDate, radExamTime2);
    const messages = [order, radExam, timeMessage, radExamPersonnel, timeMessage2];

    // Update the redux state to set startDate to a pastDate.
    store.dispatch(updateDate(pastDate));

    expect(store.getState().board.startDate).toEqual(pastDate);

    forEach((message) => {dispatchMessage(store, message)}, messages);
    store.dispatch(flushBuffer());

    await flushAllPromises();

    expect(store.getState().board.orders).toHaveLength(1);
    expect(store.getState().buffer).toEqual({orders: {}, radExams: {}, misc: []});
  });

  it("doesn't fetch anything if the message isn't for today", async () => {
    fetchMock.restore();
    fetchMock.get("/exams/799946?table=orders", [order_799888]);

    expect(store.getState().board.orders).toHaveLength(0);
    expect(store.getState().buffer).toEqual({orders: {}, radExams: {}, misc: []});

    store.dispatch(updateSelectedResourceGroup(resources, selectedResourceGroup));

    const pastDate = moment().add(-10, "days");
    // Modify the order start time to equal pastDate.
    const beginExamLens = lensPath(["payload", "pre_and_post", "pre", "begin_exam"]);
    const timeMessage = set(beginExamLens, pastDate, radExamTime);
    const timeMessage2 = set(beginExamLens, pastDate, radExamTime2);
    const messages = [order, radExam, timeMessage, radExamPersonnel, timeMessage2];

    // Update the redux state to set startDate to a pastDate.

    expect(store.getState().board.startDate).not.toEqual(pastDate);

    forEach((message) => {dispatchMessage(store, message)}, messages);
    store.dispatch(flushBuffer());

    await flushAllPromises();

    expect(store.getState().board.orders).toHaveLength(0);
    expect(store.getState().buffer).toEqual({orders: {}, radExams: {}, misc: []});
  });

  it("doesn't fetch anything if the message isn't in the selected resource group", async () => {
    fetchMock.restore();
    fetchMock.get("/exams/799946?table=orders", [order_799888]);

    expect(store.getState().board.orders).toHaveLength(0);
    expect(store.getState().buffer).toEqual({orders: {}, radExams: {}, misc: []});

    store.dispatch(updateSelectedResourceGroup(resources, selectedResourceGroup));

    const pastDate = moment().add(-10, "days");
    // Modify the order start time to equal pastDate.
    const beginExamLens = lensPath(["payload", "pre_and_post", "pre", "begin_exam"]);
    const timeMessage = set(beginExamLens, pastDate, radExamTime);
    const timeMessage2 = set(beginExamLens, pastDate, radExamTime2);
    const messages = [order, radExam, timeMessage, radExamPersonnel, timeMessage2];

    // Update the redux state to set startDate to a pastDate.

    store.dispatch(updateSelectedResourceGroup(resources, "NotAGroup"));

    // Update the redux state to set startDate to a pastDate.
    store.dispatch(updateDate(pastDate));
    expect(store.getState().board.startDate).toEqual(pastDate);

    forEach((message) => {dispatchMessage(store, message)}, messages);
    store.dispatch(flushBuffer());

    await flushAllPromises();

    expect(store.getState().board.orders).toHaveLength(0);
    expect(store.getState().buffer).toEqual({orders: {}, radExams: {}, misc: []});
  });
});
