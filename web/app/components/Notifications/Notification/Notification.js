// @flow
import React, {PureComponent} from "react";
import * as R from "ramda";

import Event from "../../OrderModal/CommentInterface/Event";
import Comment from "../../OrderModal/CommentInterface/Comment";
import RoundingUpdate from "../../OrderModal/CommentInterface/RoundingUpdate";

import type {EventT} from "../../../types";

type Props = {
  event_type: "flash" | "alert",
  event: EventT | {message: string},
  markAsDisplayed: (id: number) => void,
};

const DISPLAY_TIME = 6000;

class Notification extends PureComponent<Props> {
  componentDidMount() {
    const {event: {id}} = this.props;
    setTimeout(() => {this.props.markAsDisplayed(id)}, DISPLAY_TIME)
  }

  render() {
    const {event} = this.props;
    const event_type = R.contains(event.event_type, ["comment", "rounding-update"]) ? "info" : "event";
    return (
      <div id={`notification-${this.props.event.id}`} className={`notification ${event_type}`}>
        {this.renderNotification()}
      </div>
    )
  }

  renderRoundingUpdate() {
    const {event} = this.props;

    return <RoundingUpdate key={event.id} hideAvatar={true} hideDiff={true} {...event} />;
  }

  renderNotification() {
    const {event} = this.props;
    if (event.event_type === "rounding-update") {
      return this.renderRoundingUpdate(event);
    } else if (R.has("message", event)) {
      return <span>{event.message}</span>;
    }

    const Component = event.event_type === "comment" ? Comment : Event;
    return <Component key={event.id} hideAvatar={true} {...event} />;
  }
}

export default Notification;
