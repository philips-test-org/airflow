// @flow

import React, {Component} from "react";
import * as R from "ramda";

import Event from "./Event";
import Comment from "./Comment";
import RoundingUpdate from "./RoundingUpdate";
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
  resourceMap: {[number]: string},
  user: User,
}

class CommentInterface extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return !R.equals(nextProps, this.props);
  }

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
    const {events: undupedEvents} = this.props;
    const events = this.deduplicateEvents(undupedEvents);
    const groupedEvents = R.groupBy(
      ({event_type}) => R.equals("comment", event_type) ? "comment" : "event",
      events
    );

    return (
      <div className="events tab-content">
        <div role="tabpanel" className="event-list-pane tab-pane active" id="comment-list">
          {this.renderComments(R.propOr([], "comment", groupedEvents))}
        </div>
        <div role="tabpanel" className="event-list-pane tab-pane" id="event-list">
          {this.renderEvents(R.propOr([], "event", groupedEvents))}
        </div>
        <div role="tabpanel" className="event-list-pane tab-pane" id="combined-events-list">
          {this.renderMixedEvents(events)}
        </div>
      </div>
    )
  }

  renderEvents(events) {
    return R.map((event) => {
      if (event.event_type === "rounding-update") {
        return this.renderRoundingUpdate(event);
      }
      return <Event key={event.id} resourceMap={this.props.resourceMap} {...event} />
    }, events);
  }

  renderComments(comments) {
    return R.map((comment) => (
      <Comment key={comment.id} {...comment} />
    ), comments);
  }

  renderRoundingUpdate(event: EventT) {
    const {events: undupedEvents} = this.props;
    const events = this.deduplicateEvents(undupedEvents);
    const thisIndex = R.findIndex(R.propEq("id", event.id), events) + 1;
    const previousUpdate = R.compose(
      R.take(1),
      R.drop(thisIndex),
      R.filter(R.propEq("event_type", "rounding-update"))
    )(events)
    return <RoundingUpdate key={event.id} lastUpdate={previousUpdate} {...event} />
  }

  renderMixedEvents(events: Array<EventT>) {
    return R.map((event) => {
      if (event.event_type === "rounding-update") {
        return this.renderRoundingUpdate(event);
      }

      const Component = event.event_type === "comment" ? Comment : Event;
      return <Component key={event.id} resourceMap={this.props.resourceMap} {...event} />
    }, events);
  }

  deduplicateEvents(events: Array<EventT>) {
    if (R.isEmpty(events)) return events;
    let acc = [];
    let i = 0;
    while (i < events.length) {
      const event = events[i];
      let j = i + 1;
      let nextEvent = events[j];
      let mergedEvent = Object.assign({}, event, {orderNumbers: [event.orderNumber]});
      while (this.sameEvent(event, nextEvent)) {
        let updatedOrderNumbers = R.contains(nextEvent.orderNumber, mergedEvent.orderNumbers) ?
          mergedEvent.orderNumbers :
          R.append(nextEvent.orderNumber, mergedEvent.orderNumbers);
        mergedEvent = Object.assign(mergedEvent, {
          merged: true,
          orderNumbers: updatedOrderNumbers,
        });
        j += 1;
        nextEvent = events[j];
      }
      acc.push(mergedEvent);
      i = j;
    }
    return acc;
  }

  sameEvent(eventA: EventT, eventB: EventT) {
    const getExamId = R.prop("exam_adjustment_id");
    const getEventType = R.prop("event_type");
    const getCreatedAt = R.prop("created_at");

    const differentExams = getExamId(eventA) != getExamId(eventB);
    const sameType = getEventType(eventA) == getEventType(eventB);
    const createdTogether = (getCreatedAt(eventA) - getCreatedAt(eventB)) < 2000;
    return differentExams && sameType && createdTogether;
  }

}

export default CommentInterface;
