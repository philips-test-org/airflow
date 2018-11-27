// @flow

import React, {Component} from "react";
import * as R from "ramda";
import moment from "moment";

import Event from "./Event";
import Comment from "./Comment";
import RoundingUpdate from "./RoundingUpdate";
import CommentForm from "./CommentForm";

import type {
  DedupedEvent,
  Event as EventT,
  User,
} from "../../../types";

type Props = {
  avatar: ?Object,
  events: Array<Object>,
  fetchAvatar: (userId: number) => void,
  handleNewComment: (comment: string) => void,
  onOpenAuditHistory: () => void,
  onCloseAuditHistory: () => void,
  personEvents: Array<AnnotatedEvent>,
  resourceMap: {[number]: string},
  user: User,
}

type AnnotatedEvent = {|
  orderNumber: string,
  orderNumbers: Array<string>,
  mergedOrder: boolean,
|} & EventT

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
          <li role="presentation" className="event-list-nav active" onClick={this.props.onCloseAuditHistory}>
            <a href="#comment-list" aria-controls="comment-list" role="tab" data-toggle="tab">
              Comments
            </a>
          </li>
          <li role="presentation" className="event-list-nav" onClick={this.props.onCloseAuditHistory}>
            <a href="#event-list" aria-controls="event-list" role="tab" data-toggle="tab">
              Events
            </a>
          </li>
          <li role="presentation" className="event-list-nav" onClick={this.props.onCloseAuditHistory}>
            <a href="#combined-events-list" aria-controls="combined-events-list" role="tab" data-toggle="tab">
              All
            </a>
          </li>
          <li role="presentation" className="event-list-nav" onClick={this.props.onOpenAuditHistory}>
            <a href="#patient-events-list" aria-controls="patient-events-list" role="tab" data-toggle="tab">
              Audit History
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
          {this.renderMixedEvents(events, false, false)}
        </div>
        <div role="tabpanel" className="event-list-pane tab-pane" id="patient-events-list">
          {this.props.personEvents
            ? this.renderMixedEvents(this.deduplicateEvents(this.props.personEvents), true, true)
            : <i className="fa fa-spinner fa-spin" />
          }
        </div>
      </div>
    )
  }

  renderEvents(events) {
    return R.map((event) => {
      if (event.event_type === "rounding-update") {
        return this.renderRoundingUpdate(event, false, false);
      }
      return <Event key={event.id} resourceMap={this.props.resourceMap} {...event} />
    }, events);
  }

  renderComments(comments) {
    return R.map((comment) => (
      <Comment key={comment.id} {...comment} />
    ), comments);
  }

  renderRoundingUpdate(event: EventT, hideDiff: boolean, showOrderNumber: boolean) {
    const {events: undupedEvents} = this.props;
    const events = this.deduplicateEvents(undupedEvents);
    const thisIndex = R.findIndex(R.propEq("id", event.id), events) + 1;
    const previousUpdate = R.compose(
      R.take(1),
      R.drop(thisIndex),
      R.filter(R.propEq("event_type", "rounding-update"))
    )(events)
    return <RoundingUpdate key={event.id} lastUpdate={previousUpdate} {...event} hideDiff={hideDiff} showOrderNumber={showOrderNumber} />
  }

  renderMixedEvents(events: Array<DedupedEvent>, hideRoundingDiff: boolean, showOrderNumber: boolean) {
    return R.map((event) => {
      if (event.event_type === "rounding-update") {
        return this.renderRoundingUpdate(event, hideRoundingDiff, showOrderNumber);
      }

      const Component = event.event_type === "comment" ? Comment : Event;
      return <Component key={event.id} resourceMap={this.props.resourceMap} {...event} showOrderNumber={showOrderNumber} />
    }, events);
  }

  deduplicateEvents(events: Array<AnnotatedEvent>): Array<DedupedEvent> {
    if (R.isEmpty(events)) return [];
    let acc: Array<DedupedEvent> = [];
    let i = 0;
    while (i < events.length) {
      const event = events[i];
      let j = i + 1;
      let nextEvent = events[j];
      let mergedEvent: DedupedEvent = Object.assign({}, event, {orderNumbers: [event.orderNumber], merged: false});
      while (this.sameEvent(event, nextEvent)) {
        let updatedOrderNumbers = R.contains(nextEvent.orderNumber, mergedEvent.orderNumbers) ?
          mergedEvent.orderNumbers :
          R.append(nextEvent.orderNumber, mergedEvent.orderNumbers);
        mergedEvent = Object.assign({}, mergedEvent, {
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
    const getCreatedAt = (event) => this.createdAt(R.prop("created_at", event));

    const differentExams = getExamId(eventA) != getExamId(eventB);
    const sameType = getEventType(eventA) == getEventType(eventB);
    const createdTogether = (getCreatedAt(eventA) - getCreatedAt(eventB)) < 2000;
    return differentExams && sameType && createdTogether;
  }

  createdAt(createdAt): moment {
    return moment.isMoment(createdAt) ? createdAt : moment(createdAt);
  }
}

export default CommentInterface;
