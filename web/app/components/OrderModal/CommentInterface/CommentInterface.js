// @flow

import React, {Component} from 'react';
import * as R from "ramda";

import Event from "./Event";

type Props = {
  avatar: ?Object,
  events: Array<Object>,
  fetchAvatar: (userId: number) => void,
  orderId: number,
  userId: number,
}

class CommentInterface extends Component {
  componentWillMount() {
    console.log(this.props)
    if (R.isNil(this.props.avatar)) {
      this.props.fetchAvatar(this.props.userId);
    }
  }

  render() {
    return (
      <div className="col-xs-6">
        {this.renderCommentForm()}
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

  renderCommentForm() {
    return (
      <form id="comment-form">
        <div className="comment">
          <div className="avatar">
            <img className="avatar" src={this.props.avatar} />
          </div>
          <div className="body">
            <div className="heading form">
              Add comment to the order:
            </div>
            <div className="content">
              <textarea name="comments" className="form-control comment-box" autoFocus></textarea>
              <input type="hidden" name="order_id" value="{this.props.orderId}" />
            </div>
            <div className="footer">
              <div className="pull-right">
                <button className="btn btn-default add-comment">Add Comment</button>
              </div>
              <div style={{clear: "both"}}></div>
            </div>
          </div>
        </div>
      </form>
    )
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
          {this.renderEvents(R.propOr([], "comment", groupedEvents))}
        </div>
        <div role="tabpanel" className="event-list-pane tab-pane" id="event-list">
          {this.renderEvents(R.propOr([], "event", groupedEvents))}
        </div>
        <div role="tabpanel" className="event-list-pane tab-pane" id="combined-events-list">
          {this.renderEvents(this.props.events)}
        </div>
      </div>
    )
  }

  renderEvents(events) {
    R.map((event) => (
      <Event key={event.id} {...event} />
    ), events);
  }
}

export default CommentInterface;
