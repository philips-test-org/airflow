// @flow

import React, {Component} from "react";
import Toggle from "react-toggle";

type Props = {
  faClass: string,
  isActive: boolean,
  label: string,
  name: string,
  handleChange: (eventType: string, newState: Object) => void,
}

type State = {
  checked: boolean,
}

class StatusToggle extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      checked: this.props.isActive,
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isActive !== this.state.checked) {
      this.setState({checked: newProps.isActive})
    }
  }

  render() {
    return (
      <div className="status-toggle">
        <label className="wrapped-toggle">
          <span><i className={`fa ${this.props.faClass}`}></i>{this.props.label}</span>
          <Toggle
            checked={this.state.checked}
            onChange={this.handleChange}
          />
        </label>
      </div>
    );
  }

  handleChange = () => {
    const {name} = this.props;

    const newState = !this.state.checked;
    this.props.handleChange(name, {[name]: newState})
    this.setState({checked: newState});
  }
}

export default StatusToggle;
