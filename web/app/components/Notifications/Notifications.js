// @flow
import React, {Component} from "react";
import * as R from "ramda";

import Notification from "./Notification";

import type {
  Notification as NotificationT,
} from "../../types";

type Props = {
  markNotificationDisplayed: (id: number | string) => void,
  notifications: Array<NotificationT>,
};

type State = {
  undisplayed: Array<NotificationT>,
};

class Notifications extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      undisplayed: [],
    }
  }

  shouldComponentUpdate(newProps: Props) {
    return !R.equals(newProps, this.props);
  }

  static getDerivedStateFromProps({notifications: nextNotifications}: Props) {
    // Enqueue new notifications
    const newNotifications = R.reject(
      R.path(["event", "displayed"]),
      nextNotifications
    );
    return {
      undisplayed: newNotifications,
    };
  }

  render() {
    return (
      <div id="notifications">
        {R.map(this.renderNotification, this.state.undisplayed)}
      </div>
    );
  }

  renderNotification = ({event_type, event}: NotificationT) => (
    <Notification
      key={event.id}
      event_type={event_type}
      event={event}
      markAsDisplayed={this.props.markNotificationDisplayed}
    />
  )
}

export default Notifications;
