// @flow

import React, {Component} from "react";
import * as R from "ramda";
import {withTranslation} from "react-i18next";

import {
  avatarPath,
  formatTimestamp,
} from "../../../../lib";

import type {
  DedupedEvent,
} from "../../../../types";

type ExtraProps = {
  resourceMap: {[string]: string},
  hideAvatar: boolean,
  t:(label: string) =>string
};

type Props = DedupedEvent & ExtraProps;

const EVENT_LABELS = {
  onhold: "On Hold",
  anesthesia: "Anesthesia",
  consent: "Consent",
  ppca_arrival: "PPCA Arrival",
  ppca_ready: "PPCA Ready",
  paperwork: "Paperwork",
  location_update: "Location",
  t:(label: string) =>string
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
  },
}

const FA_CLASS = {
  onhold: "fa fa-hand-paper-o",
  anesthesia: "",
  consent: "fa fa-handshake-o",
  ppca_arrival: "fa fa-thumbs-o-up",
  paperwork: "fa fa-file-text",
}

class Event extends Component<Props> {
  static defaultProps: {hideAvatar: boolean}

  shouldComponentUpdate(nextProps: Props) {
    return !R.equals(nextProps, this.props);
  }

  render() {
    const {employee, hideAvatar} = this.props;
    const avatarSrc = avatarPath(employee.id);
    return (
      <div className="event">
        {hideAvatar ? null :
          <span className="avatar">
            <img className="avatar" src={avatarSrc} />
          </span>
        }
        {this.renderVerbage()}
      </div>
    );
  }

  renderEventLabel() {
    const {event_type} = this.props;
    const eventLabel = EVENT_LABELS[event_type];
    const faClass = FA_CLASS[event_type];
    return (
      <strong><i className={faClass}></i> {this.props.t(`LABEL_${eventLabel.toUpperCase().replace(/\s/g, '')}`)} </strong>
    )
  }

  renderEventStatus() {
    const {event_type, new_state} = this.props;
    if (event_type !== "location_update") {
      const eventBool = new_state[event_type].toString();
      const eventState = EVENT_STATES[eventBool][event_type];
      const eventClass = new_state[event_type] ? "label-primary" : "label-default";
      return (
        <span className={`label ${eventClass}`}>{this.props.t(`LABEL_${eventState.toUpperCase().replace(/\s/g, '')}`)}</span>
      )
    }
    return null;
  }

  renderVerbage() {
    const {employee: {name}, event_type, created_at, new_state, resourceMap} = this.props;
    const eventTime = formatTimestamp(created_at);
    if (event_type !== "location_update") {
      return (
        <div className="body">
          <strong>{name}</strong> {this.props.t('LABEL_MARKED')} {this.renderEventLabel()} {this.renderEventStatus()} {this.props.t('LABEL_OCCURED_ON')} <span className="time short">{eventTime}</span> {this.renderMergedIcon()} {this.renderOrderNumber()}
        </div>
      )
    } else if (event_type === "location_update") {
      return (
        <div className="body">
          <strong>{name}</strong> {this.props.t('MESSAGE_MOVED_ORDER')} <strong>{R.prop(new_state.resource_id, resourceMap)}</strong> @ <span className="time short"><strong>{formatTimestamp(new_state.start_time)}</strong></span> {this.props.t('LABEL_OCCURED_ON')} <span className="time short">{eventTime}</span> {this.renderMergedIcon()} {this.renderOrderNumber()}
        </div>
      )
    }
    return (
      <span className="body">
        <strong>{name}</strong> {this.props.t('MESSAGE_DID_SOMETHINGAT')} <span className="time short">{eventTime}</span>
      </span>
    )
  }

  renderMergedIcon() {
    return R.prop("merged", this.props) ? <i className="fa fa-compress"></i> : null;
  }

  renderOrderNumber() {
    const {orderNumber, orderNumbers} = this.props;
    let num;
    if (orderNumbers) {
      num = orderNumbers.join(", ");
    } else if (orderNumber) {
      num = orderNumber;
    } else {
      return null;
    }

    return (
      <div className="event-footer">
        <strong>{this.props.t('LABEL_ORDER')}:</strong> {num}
      </div>
    );
  }
}

Event.defaultProps = {hideAvatar: false};

export default withTranslation()(Event);
