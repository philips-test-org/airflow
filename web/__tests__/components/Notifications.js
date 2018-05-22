import {shallow} from "enzyme";
import * as jsc from "jsverify";
import * as R from "ramda";

import Notifications from "../../app/components/Notifications";
import Notification from "../../app/components/Notifications/Notification";
import {eventGen} from "../generators";

const markNotificationDisplayed = () => {};

describe("<Notifications>", () => {
  it("renders 1 Notification", () => {
    const notifications = [
      {
        type: "info",
        event: {
          id: "connected-apm",
          event_type: "info",
          message: "Connected to APM",
          displayed: false,
        },
      },
    ];
    const wrapper = shallow(
      <Notifications
        notifications={notifications}
        markAsDisplayed={markNotificationDisplayed}
      />
    );
    expect(wrapper.find(Notification).length).toEqual(1);
  });

  it("renders 1 Notification when others marked as displayed", () => {
    const notifications = [
      {
        type: "info",
        event: {
          id: "connected-apm",
          event_type: "info",
          message: "Connected to APM",
          displayed: true,
        },
      },
      {
        type: "info",
        event: {
          id: 1,
          event_type: "info",
          message: "Something happened",
          displayed: true,
        },
      },
      {
        type: "info",
        event: {
          id: 2,
          event_type: "info",
          message: "Something else happened",
          displayed: false,
        },
      },
    ];
    const wrapper = shallow(
      <Notifications
        notifications={notifications}
        markAsDisplayed={markNotificationDisplayed}
      />
    );
    expect(wrapper.find(Notification).length).toEqual(1);
  });

  jsc.property("property: render only undisplayed Notifications", jsc.array(eventGen), (events) => {
    const nUndisplayed = R.length(R.reject(R.path(["event", "displayed"]), events));
    const wrapper = shallow(
      <Notifications
        notifications={events}
        markAsDisplayed={markNotificationDisplayed}
      />
    );
    return wrapper.find(Notification).length == nUndisplayed;
  });
});
