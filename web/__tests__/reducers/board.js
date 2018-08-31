import * as R from "ramda";
import * as jsc from "jsverify";

import board from "../../app/lib/reducers/board";
import {
  dispatchNotification,
  markNotificationDisplayed,
} from "../../app/lib/actions/board";
import {eventGen} from "../generators";

const notificationTransform = (notification) =>
  R.omit(["type"], R.merge({event_type: notification.type}, notification))

describe("board reducer", () => {
  let initState;

  beforeEach(() => {
    initState = board(undefined, {});
  });

  it("adds a new notification on DISPATCH_NOTIFICATION", () => {
    const notification = {
      type: "info",
      event: {
        id: "connected-apm",
        event_type: "alert",
        message: "Connected to APM",
        displayed: false,
      },
    };
    const res = {
      event_type: "info",
      event: {
        id: "connected-apm",
        event_type: "alert",
        message: "Connected to APM",
        displayed: false,
      },
    };
    expect(board(initState, dispatchNotification(notification))).toHaveProperty("notifications", [res]);
  });

  it("removes disconnection notifications after reconnecting", () => {
    const disconnect = {
      type: "alert",
      event: {
        id: "disconnect",
        event_type: "alert",
        message: "You are no longer receiving real time updates. Please reload the page and log in again.",
        displayed: false,
      },
    };

    const connected = {
      type: "info",
      event: {
        id: "connected-apm",
        event_type: "alert",
        message: "Connected to APM",
        displayed: false,
      },
    };

    expect(initState).toHaveProperty("notifications", []);
    const disconnected = board(initState, dispatchNotification(disconnect));
    expect(disconnected).toHaveProperty("notifications", [notificationTransform(disconnect)]);
    const reconnected = board(disconnected, dispatchNotification(connected));
    expect(reconnected).toHaveProperty("notifications", [notificationTransform(connected)]);
  })

  jsc.property(
    "property: update a notification displayed attribute on MARK_NOTIFICATION_DISPLAYED",
    eventGen,
    (event) => {
      const withEvent = board(initState, dispatchNotification(event));
      const eventComplete = board(withEvent, markNotificationDisplayed(event.event.id));
      const completedNotification = R.mergeDeepLeft({event: {displayed: true}}, event);

      const hasInitState = R.propEq("notifications", [notificationTransform(event)], withEvent);
      const notificationMarked = R.propEq(
        "notifications",
        [notificationTransform(completedNotification)],
        eventComplete
      );
      return hasInitState && notificationMarked;
    }
  );
});
