// @flow

import React, {Component} from "react";
import * as R from "ramda";

import Event from "./Event";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

import type {
  Event as EventT,
  User,
} from "../../../types";

type Props = {
  avatar: ?Object,
  events: Array<Object>,
  fetchAvatar: (userId: number) => void,
  handleNewComment: (comment: string) => void,
  orderId: number,
  user: User,
}

class CommentInterface extends Component<Props> {
  render() {
    return (
      <div className="col-xs-6">
        <CommentForm userId={this.props.user.id} handleSubmit={this.props.handleNewComment} />
        <hr />
        <ul className="nav nav-tabs nav-bottom-margin" role="tablist">
          <li role="presentation" className="event-list-nav active">
            <a href="#comment-list" aria-controls="comment-list" role="tab" data-toggle="tab">
              Comments
            </a>
          </li>
          <li role="presentation" className="event-list-nav">
            <a href="#event-list" aria-controls="event-list" role="tab" data-toggle="tab">
              Events
            </a>
          </li>
          <li role="presentation" className="event-list-nav">
            <a href="#combined-events-list" aria-controls="combined-events-list" role="tab" data-toggle="tab">
              All
            </a>
          </li>
        </ul>
        {this.renderEventList()}
      </div>
    );
  }

  renderEventList() {
    const groupedEvents = R.groupBy((event) => {
      const type = event.event_type;
      return type === "comment" ? "comment" :
        type === "rounding-update" ? "rounding" :
          "event";
    }, this.props.events);

    return (
      <div className="events tab-content">
        <div role="tabpanel" className="event-list-pane tab-pane active" id="comment-list">
          {this.renderComments(R.propOr([], "comment", groupedEvents))}
        </div>
        <div role="tabpanel" className="event-list-pane tab-pane" id="event-list">
          {this.renderEvents(R.propOr([], "event", groupedEvents))}
        </div>
        <div role="tabpanel" className="event-list-pane tab-pane" id="combined-events-list">
          {this.renderMixedEvents(this.props.events)}
        </div>
      </div>
    )
  }

  renderEvents(events) {
    return R.map((event) => (
      <Event key={event.id} {...event} />
    ), events);
  }

  renderComments(comments) {
    return R.map((comment) => (
      <Comment key={comment.id} {...comment} />
    ), comments);
  }

  renderMixedEvents(events: Array<EventT>) {
    return R.map((event) => {
      const Component = R.equals(event.event_type, "comment") ? Comment : Event;
      return <Component key={event.id} {...event} />
    }, events);
  }
}

export default CommentInterface;
