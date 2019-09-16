// @flow

import React, {PureComponent} from "react";
import * as R from "ramda";

import {formatTimestamp} from "../../../lib";

import Button from "../../Common/Button";

import type {Event} from "../../../types";
import {withTranslation} from "react-i18next";

type Props = {
  rounding: Event,
  handleSubmit: (value: string) => void,
  t:(label: string) =>string
}

type State = {
  editing: boolean,
  roundingValue: string,
}

class RoundingInterface extends PureComponent<Props, State> {
  roundingField: ?HTMLTextAreaElement;

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
              <h5>{this.props.t('LABEL_ROUNDING')}</h5>
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
    const roundingValue = this.state.roundingValue ? this.state.roundingValue : this.props.t('MESSAGE_NOROUNDINGDATA');
    return (
      <div className="rounding">
        <p className="rounding-text">{roundingValue}</p>
      </div>
    )
  }

  componentDidUpdate() {
    if (this.state.editing && this.roundingField) {
      this.roundingField.value = this.state.roundingValue;
    }
  }

  renderRoundingForm() {
    return (
      <form id="rounding-form" className="rounding">
        <div className="body">
          <div className="content">
            <textarea
              name="rounding"
              className="form-control rounding-box"
              rows="9"
              autoFocus
              ref={el => this.roundingField = el }
              placeholder={this.props.t('MESSAGE_NOROUNDINGDATA')}
            />
          </div>
          <div className="footer">
            <div className="pull-right">
              <Button
                text={this.props.t('LABEL_CANCEL')}
                className="btn-warning edit-rounding-cancel"
                handleClick={this.stopEditing}
              />
              <Button
                text={this.props.t('LABEL_SAVE')}
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
        <p className="edited-by">{this.props.t('LABEL_LASTEDITEDBY')}: {employee.name} on <span className="time short">{formatTimestamp(created_at)}</span>
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
    if (this.roundingField && this.roundingField.value !== "") {
      this.props.handleSubmit(this.roundingField.value);
      this.setState({
        editing: false,
        // $FlowFixMe
        roundingValue: this.roundingField.value,
      });
    }
  }
}

export default withTranslation()(RoundingInterface);
