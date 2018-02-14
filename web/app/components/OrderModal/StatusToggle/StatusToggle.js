// @flow

import React, {Component} from 'react';

type Props = {
  faClass: string,
  isActive: boolean,
  label: string,
}

class StatusToggle extends Component {
  render() {
    return (
      <div className="status-toggle margin-right-sm">
        <label><i className={`fa ${this.props.faClass}`}></i>{this.props.label}</label>
        <input
          type="checkbox"
          name="onhold"
          checked={this.props.isActive}
          data-size="mini"
          data-on={this.props.label}
          data-off="Active"
          data-toggle="toggle"
          data-width="105"
          />
      </div>
    );
  }
}

export default StatusToggle;
