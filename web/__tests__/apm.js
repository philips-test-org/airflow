import {lensPath, set} from "ramda";
import moment from "moment";

import fetchMock from "fetch-mock";

import storeFunc from "../app/lib/store";
import {processMessage} from "../app/lib/apm_middleware";
import {updateSelectedResourceGroup} from "../app/lib/actions";
import {flushAllPromises} from "./helpers";

import sameResourceMessage from "./mockState/messages/sameResourceMessage";
import differentResourceMessage from "./mockState/messages/differentResourceMessage";
import auditSameResourceMessage from "./mockState/messages/auditSameResourceMessage";
import singleExamResource1 from "./mockState/singleExamResource1";
import singleExamResource3 from "./mockState/singleExamResource3";

describe("APM messages coming from airflow", () => {
  let store;
  let resources;
  let selectedResourceGroup;

  beforeEach(() => {
    store = storeFunc();
    resources = {
      "Group": [
        {id: 1},
      ],
    };
    selectedResourceGroup = "Group";
  });

  it("adds an app notification when the message contains an order is within a selected resource", () => {
    expect(store.getState().board.notifications).toHaveLength(0);

    store.dispatch(updateSelectedResourceGroup(resources, selectedResourceGroup));
    processMessage(sameResourceMessage, store);

    expect(store.getState().board.notifications).toHaveLength(1);
  });

  it("does not add a notification when the message contains order is not within a selected resource", () => {
    expect(store.getState().board.notifications).toHaveLength(0);

    store.dispatch(updateSelectedResourceGroup(resources, selectedResourceGroup));
    processMessage(differentResourceMessage, store);

    expect(store.getState().board.notifications).toHaveLength(0);
  });

  it("does not add a notification when the message is for an order that doesn't take place today", () => {
    expect(store.getState().board.notifications).toHaveLength(0);

    store.dispatch(updateSelectedResourceGroup(resources, selectedResourceGroup));

    const beginExamLens = lensPath(["payload", "adjusted", "start_time"]);
    const pastDate = moment().add(-10, "days").unix() * 1000;
    const message = set(beginExamLens, pastDate, sameResourceMessage);
    processMessage(message, store);

    expect(store.getState().board.notifications).toHaveLength(0);
  });
});

describe("APM updates orders with messages from the platform", () => {
  let store;
  let resources;
  let selectedResourceGroup;

  beforeEach(() => {
    store = storeFunc();
    resources = {
      "Group": [
        {id: 1},
      ],
    };
    selectedResourceGroup = "Group";
  });

  it("updates/adds an order when the message contains an order is within a selected resource", async () => {
    fetchMock.restore();
    fetchMock.get("/exams/769879?table=rad_exams", [singleExamResource1]);

    expect(store.getState().board.orders).toHaveLength(0);

    store.dispatch(updateSelectedResourceGroup(resources, selectedResourceGroup));
    processMessage(auditSameResourceMessage, store);

    await flushAllPromises();

    expect(store.getState().board.orders).toHaveLength(1);
  });

  it("does not update/add an order when the message does not contain an order is within a selected resource", async () => {
    fetchMock.restore();
    fetchMock.get("/exams/769879?table=rad_exams", [singleExamResource3]);

    expect(store.getState().board.orders).toHaveLength(0);

    store.dispatch(updateSelectedResourceGroup(resources, selectedResourceGroup));
    processMessage(auditSameResourceMessage, store);

    await flushAllPromises();

    expect(store.getState().board.orders).toHaveLength(0);
  });
});
