// @flow
import React, {PureComponent} from "react";
import * as R from "ramda";

import Notification from "./Notification";

import type {Event} from "../../types";

type NotificationT = {event_type: "flash" | "alert", event: Event};

type Props = {
  notifications: Array<NotificationT>,
};

type State = {
  displayed: Array<NotificationT>,
};

class Notifications extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      displayed: [],
      undisplayed: [],
    }
  }

  static getDerivedStateFromProps({notifications: nextNotifications}: Props, {displayed, undisplayed}: State) {
    const getEventId = R.map(R.path(["event", "id"]));
    if (nextNotifications.length != (displayed.length + undisplayed.length)) {
      // Enqueue new notifications
      const newNotifications = R.reject(
        ({event: {id}}) => R.contains(id, displayed) || R.contains(id, getEventId(undisplayed)),
        nextNotifications
      );
      return {
        undisplayed: R.concat(undisplayed, newNotifications),
      };
    }
    return null;
  }

  render() {
    return (
      <div id="notifications">
        {R.map(this.renderNotification, this.state.undisplayed)}
      </div>
    );
  }

  renderNotification = ({event_type, event}: NotificationT) => (
    <Notification key={event.id} event_type={event_type} event={event} markAsDisplayed={this.markAsDisplayed} />
  )

  markAsDisplayed = (id: number) => {
    this.setState({
      displayed: R.prepend(id, this.state.displayed),
      undisplayed: R.reject(({event: {id: undisplayedId}}) => id == undisplayedId, this.state.undisplayed),
    });
  }
}

export default Notifications;
