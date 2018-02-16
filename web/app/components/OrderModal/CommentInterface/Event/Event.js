// @flow

import React, {Component} from "react";

import {formatTimestamp} from "../../../../lib/utility";

import type {
  Event as EventT,
} from "../../../../types";

type Props = EventT;

const EVENT_LABELS = {
  onhold: "On Hold",
  anesthesia: "Anesthesia",
  consent: "Consent",
  ppca_ready: "PPCA Ready",
  paperwork: "Paperwork",
}

const EVENT_STATES = {
  true: {
    onhold: "Active",
    anesthesia: "Complete",
    consent: "Complete",
    ppca_ready: "Complete",
    paperwork: "Complete",
  },
  false: {
    onhold: "Inactive",
    anesthesia: "Incomplete",
    consent: "Incomplete",
    ppca_ready: "Incomplete",
    paperwork: "Incomplete",
  }
}

const FA_CLASS = {
  onhold: "fa fa-hand-paper-o",
  anesthesia: "",
  consent: "fa fa-handshake-o",
  ppca_ready: "fa fa-thumbs-o-up",
  paperwork: "fa fa-file-text",
}

class Event extends Component<Props> {
  render() {
    const {employee, created_at} = this.props;
    return (
      <div className="event">
        <span className="avatar">
          <img className="avatar" src={`/avatar/${employee.id}`} />
        </span>
        <span className="body">
          <strong>{employee.name}</strong> marked {this.renderEventLabel()} {this.renderEventStatus()} on <span className="time short">{formatTimestamp(created_at)}</span>
        </span>
      </div>
    );
  }

  renderEventLabel() {
    const {event_type} = this.props;
    const eventLabel = EVENT_LABELS[event_type];
    const faClass = FA_CLASS[event_type];
    return (
      <strong><i className={faClass}></i> {eventLabel} </strong>
    )
  }

  renderEventStatus() {
    const {event_type, new_state} = this.props;
    const eventBool = new_state[event_type].toString();
    const eventState = EVENT_STATES[eventBool][event_type];
    const eventClass = new_state[event_type] ? "label-primary" : "label-default";
    return (
      <span className={`label ${eventClass}`}>{eventState}</span>
    )
  }
}
/*
TODO: Handle these cases

<script className="handlebars-template" id="t-event-location-change" type="text/x-handlebars-template">
  <div className="event">
    <span className="avatar">{{avatar employee.id "<%= image_url('placeholder.png') %>"}}</span>
    <span className="body">
      <strong>{{employee.name}}</strong> moved order to <strong>{{resource_name new_state.resource_id}}</strong> to <span className="time short"><strong>{{format_timestamp new_state.start_time}}</strong></span> on <span className="time short">{{format_timestamp created_at}}</span>
    </span>
  </div>
</script>

<script className="handlebars-template" id="t-event-rounding-update" type="text/x-handlebars-template">
  <div className="comment">
    <div className="avatar">
      <!-- should be the employee associated with the action -->
      {{avatar employee.id "<%= image_url('placeholder.png') %>"}}
    </div>
    <div className="body">
      <div className="heading">
        <!-- should be the employee associated with the action -->
        <strong>{{employee.name}}</strong> updated rounding on <span className="time short">{{format_timestamp created_at}}</span>
      </div>
      <div className="content">{{comments}}</div>
    </div>
  </div>
</script>

*/

export default Event;
