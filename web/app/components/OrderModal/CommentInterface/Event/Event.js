// @flow

import React, {Component} from "react";

type Props = {
}

class Event extends Component<Props> {
  render() {
    return (
      <div>
      </div>
    );
  }
}
/*

<script className="handlebars-template" id="t-event-state-change" type="text/x-handlebars-template">
  <div className="event">
    <span className="avatar">{{avatar employee.id "<%= image_url('placeholder.png') %>"}}</span>
    <span className="body">
      <strong>{{employee.name}}</strong> marked {{toggle_label event_type}} {{toggle_state event_type new_state}} on <span className="time short">{{format_timestamp created_at}}</span>
    </span>
  </div>
</script>

<script className="handlebars-template" id="t-event-location-change" type="text/x-handlebars-template">
  <div className="event">
    <span className="avatar">{{avatar employee.id "<%= image_url('placeholder.png') %>"}}</span>
    <span className="body">
      <strong>{{employee.name}}</strong> moved order to <strong>{{resource_name new_state.resource_id}}</strong> to <span className="time short"><strong>{{format_timestamp new_state.start_time}}</strong></span> on <span className="time short">{{format_timestamp created_at}}</span>
    </span>
  </div>
</script>

<script className="handlebars-template" id="t-event-comment" type="text/x-handlebars-template">
  <div className="comment">
    <div className="avatar">
      <!-- should be the employee associated with the action -->
      {{avatar employee.id "<%= image_url('placeholder.png') %>"}}
    </div>
    <div className="body">
      <div className="heading">
        <!-- should be the employee associated with the action -->
        <strong>{{employee.name}}</strong> commented on <span className="time short">{{format_timestamp created_at}}</span>
      </div>
      <div className="content">{{comments}}</div>
    </div>
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
