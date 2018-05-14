// @flow

import React, {Component} from "react";
import * as R from "ramda";

import {formatTimestamp} from "../../../../lib/utility";

import type {
  Event as EventT,
} from "../../../../types";

type ExtraProps = {
  resourceMap: {[string]: string},
  hideAvatar: boolean,
};
type Props = EventT & ExtraProps;

const EVENT_LABELS = {
  onhold: "On Hold",
  anesthesia: "Anesthesia",
  consent: "Consent",
  ppca_arrival: "PPCA Arrival",
  ppca_ready: "PPCA Ready",
  paperwork: "Paperwork",
  location_update: "Location"
}

const EVENT_STATES = {
  true: {
    onhold: "Active",
    anesthesia: "Complete",
    consent: "Complete",
    ppca_ready: "Complete",
    ppca_arrival: "Complete",
    paperwork: "Complete",
  },
  false: {
    onhold: "Inactive",
    anesthesia: "Incomplete",
    consent: "Incomplete",
    ppca_ready: "Incomplete",
    ppca_arrival: "Incomplete",
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
  shouldComponentUpdate(nextProps: Props) {
    return !R.equals(nextProps, this.props);
  }

  render() {
    const {employee, renderAvatar} = this.props;
    return (
      <div className="event">
        {renderAvatar ?
          <span className="avatar">
            <img className="avatar" src={`/avatar/${employee.id}`} />
          </span> :
          null}
        {this.renderVerbage()}
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
    if (event_type !== "location_update") {
      const eventBool = new_state[event_type].toString();
      const eventState = EVENT_STATES[eventBool][event_type];
      const eventClass = new_state[event_type] ? "label-primary" : "label-default";
      return (
        <span className={`label ${eventClass}`}>{eventState}</span>
      )
    }
    return null;
  }

  renderVerbage() {
    const {employee: {name}, event_type, created_at, new_state, resourceMap} = this.props;
    const eventTime = formatTimestamp(created_at);
    if (event_type !== "location_update") {
      return (
        <span className="body">
          <strong>{name}</strong> marked {this.renderEventLabel()} {this.renderEventStatus()} on <span className="time short">{eventTime}</span>
        </span>
      )
    } else if (event_type === "location_update") {
      return (
        <span className="body">
          <strong>{name}</strong> moved order to <strong>{R.prop(new_state.resource_id, resourceMap)}</strong> to <span className="time short"><strong>{formatTimestamp(new_state.start_time)}</strong></span> on <span className="time short">{eventTime}</span>
        </span>
      )
    }
    return (
      <span className="body">
        <strong>{name}</strong> did something at <span className="time short">{eventTime}</span>
      </span>
    )
  }
}

Event.defaultProps = {hideAvatar: false};

export default Event;
