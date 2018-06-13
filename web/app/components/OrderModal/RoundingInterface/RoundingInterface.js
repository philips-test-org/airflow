// @flow

import React, {PureComponent} from "react";
import * as R from "ramda";

import {formatTimestamp} from "../../../lib";

import Button from "../../Common/Button";

import type {Event} from "../../../types";

type Props = {
  rounding: Event,
  handleSubmit: (value: string) => void,
}

type State = {
  editing: boolean,
  roundingValue: string,
}

class RoundingInterface extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const roundingValue = R.pathOr("", ["rounding", "comments"], this.props);

    this.state = {
      editing: false,
      roundingValue: roundingValue,
    }
  }

  componentWillReceiveProps(newProps: Props) {
    const roundingPath = R.path(["rounding", "comments"]);
    const newRounding = roundingPath(newProps);
    if (newRounding !== roundingPath(this.props)) {
      this.setState({roundingValue: newRounding});
    }
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <div className="row">
            <div className="col-xs-9" >
              <h5>Rounding</h5>
            </div>
            <div className="col-xs-3">
              <Button
                handleClick={this.startEditing}
                text={<i className="fa fa-pencil"></i>}
                className="btn-primary edit-rounding pull-right"
              />
            </div>
          </div>
        </div>

        <div className="panel-body">
          {this.state.editing ? this.renderRoundingForm() : this.renderRoundingValue()}
        </div>

        {this.renderEditedBy()}
      </div>
    );
  }

  renderRoundingValue() {
    const roundingValue = this.state.roundingValue ? this.state.roundingValue : "No rounding data entered.";
    return (
      <div className="rounding">
        <p className="rounding-text">{roundingValue}</p>
      </div>
    )
  }

  renderRoundingForm() {
    const {roundingValue} = this.state;
    return (
      <form id="rounding-form" className="rounding">
        <div className="body">
          <div className="content">
            <textarea
              name="rounding"
              className="form-control rounding-box"
              rows="9"
              autoFocus
              onChange={this.updateRounding}
              placeholder="No rounding data entered."
              value={roundingValue}
            />
          </div>
          <div className="footer">
            <div className="pull-right">
              <Button
                text="Cancel"
                className="btn-warning edit-rounding-cancel"
                handleClick={this.stopEditing}
              />
              <Button
                text="Save"
                className="btn-default save-rounding"
                handleClick={this.submitRounding}
              />
            </div>
            <div style={{clear: "both"}}></div>
          </div>
        </div>
      </form>
    )
  }

  renderEditedBy() {
    const roundingValue = this.props.rounding;
    if (!R.prop("employee", roundingValue)) {return null}
    const {employee, created_at} = roundingValue;
    return (
      <div className="panel-footer rounding-footer">
        <p className="edited-by">Last edited by: {employee.name} on <span className="time short">{formatTimestamp(created_at)}</span>
        </p>
      </div>
    );
  }

  updateRounding = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const roundingValue: string = event.target.value;
    if (roundingValue) {
      this.setState({roundingValue})
    }
  }

  startEditing = () => {
    this.setState({editing: true});
  }

  stopEditing = () => {
    const savedRounding = R.pathOr("", ["rounding", "comments"], this.props);
    this.setState({
      editing: false,
      roundingValue: savedRounding,
    });
  }

  submitRounding = () => {
    this.props.handleSubmit(this.state.roundingValue);
    this.setState({editing: false});
  }
}

export default RoundingInterface;
