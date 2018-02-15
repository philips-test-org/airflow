// @flow

import React, {Component} from "react";
import Toggle from "react-toggle";

type Props = {
  faClass: string,
  isActive: boolean,
  label: string,
}

class StatusToggle extends Component {
  render() {
    return (
      <div className="status-toggle">
        <label className="wrapped-toggle">
          <span><i className={`fa ${this.props.faClass}`}></i>{this.props.label}</span>
          <Toggle
            defaultChecked={this.props.isActive}
            onChange={this.handleChange}
          />
        </label>
      </div>
    );
  }

  handleChange = () => {}
}

export default StatusToggle;
