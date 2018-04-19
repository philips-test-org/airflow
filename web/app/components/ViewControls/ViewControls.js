// @flow

import React, {Component} from "react";
import * as R from "ramda";
import moment from "moment";

import {SingleDatePicker} from "react-dates";

import {STATUS_CHECKS} from "../../lib/utility";

import type {Resource} from "../../types";

type Props = {
  fetchExams: (resourceIds: Array<number>, date?: number) => void,
  resources: {[string]: Array<Resource>},
  selectedResourceGroup: string,
  selectedDate: string,
  viewType: "calendar" | "kiosk" | "overview",
}

type State = {
  showDatePicker: boolean,
  date: moment | number,
  selectedResource: string,
}

class ViewControls extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showDatePicker: false,
      selectedResource: props.selectedResourceGroup,
      date: props.selectedDate,
    }
  }

  componentWillReceiveProps(newProps: Props) {
    let updatedState = {}
    if (newProps.selectedDate !== this.props.selectedDate) {
      updatedState["date"] = newProps.selectedDate;
    }
    if (newProps.selectedResourceGroup !== this.props.selectedResourceGroup) {
      updatedState["selectedResource"] = newProps.selectedResourceGroup;
    }
    this.setState(R.merge(this.state, updatedState));
  }

  render() {
    return (
      <div id="view-controls">
        <div className="btn-group pull-left">
          <button className="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" id="legend-button">Legend <span className="caret"></span></button>
          {this.renderLegend()}
        </div>

        {this.renderDatePicker()}
        {this.renderResourceDropdown()}
      </div>
    );
  }

  renderLegend() {
    return (
      <div id="legend" aria-labelledby="legend-button" className="popover bottom">
        <div className="arrow"></div>
        <h3 className="popover-title">Legend</h3>
        <div className="popover-content">
          {R.map(this.renderStatus, STATUS_CHECKS)}
          <div className="status">
            <span className="color icon"><i className="anesthesia">GA</i></span><span className="name">Anesthesia</span>
          </div>
          <div className="status">
            <span className="color icon"><i className="fa fa-handshake-o"></i></span><span className="name">Consent</span>
          </div>
          <div className="status">
            <span className="color icon"><i className="fa fa-thumbs-up"></i></span><span className="name">PPCA Ready</span>
          </div>
          <div className="status">
            <span className="color icon"><i className="fa fa-file-text"></i></span><span className="name">Paperwork</span>
          </div>
          <div className="status">
            <span className="color"><i className="fa fa-paperclip"></i></span><span className="name">Comment(s)</span>
          </div>
        </div>
      </div>
    )
  }

  renderStatus(status: Object) {
    return (
      <div key={`status-${status.order}`} className="status">
        <span className="color" style={{backgroundColor: status.color}}></span><span className="name">{status.name}</span>
      </div>
    )
  }

  renderDatePicker() {
    if (this.props.viewType === "kiosk") {return null}
    return (
      <div className="btn-group pull-right">
        <SingleDatePicker
          date={moment(this.state.date)}
          focused={this.state.showDatePicker}
          isOutsideRange={R.F}
          numberOfMonths={1}
          onDateChange={this.selectDate}
          onFocusChange={this.toggleDatePicker}
          placeholder="Today"
          readOnly={true}
          small={true}
        />
      </div>
    )
  }

  renderResourceDropdown() {
    const {resources} = this.props;
    const {selectedResource} = this.state;
    return (
      <div className="btn-group pull-right margin-right-sm" id="resource-group-buttons">
        <button className="btn btn-default dropdown-toggle" data-value={selectedResource} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span className="group-name">{selectedResource} </span>
          <span className="caret"></span>
        </button>
        <ul className="dropdown-menu">
          {R.map(this.renderResource, R.keys(resources))}
        </ul>
      </div>
    )
  }

  renderResource = (resourceName: string) => {
    return (
      <li key={`resource-listing-${resourceName}`} onClick={this.selectResourceGroup}>
        <a data-value={resourceName} href="#">{resourceName}</a>
      </li>
    )
  }

  selectResourceGroup = (event: SyntheticInputEvent<HTMLInputElement>) => {
    event.preventDefault();
    const selectedResource = event.target.dataset.value;
    this.setState({selectedResource});
    const resourceIds = R.map(R.prop("id"), this.props.resources[selectedResource]);
    this.fetchExams({resourceIds});
  }

  selectDate = (date: moment) => {
    this.setState({date});
    this.fetchExams({date});
  }

  toggleDatePicker = () => {
    this.setState({showDatePicker: !this.state.showDatePicker});
  }

  fetchExams = ({resourceIds, date}: {resourceIds?: Array<number>, date?: moment}) => {
    const resources = resourceIds || R.map(R.prop("id"), this.props.resources[this.state.selectedResource]);
    const selectedDate = date ? date.unix() : moment(this.state.date).unix();
    this.props.fetchExams(resources, selectedDate);
  }
}

export default ViewControls;
