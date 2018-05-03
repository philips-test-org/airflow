// @flow

import React, {PureComponent} from "react";
import * as R from "ramda";
import moment from "moment";

import {SingleDatePicker} from "react-dates";

import ResourceItem from "./ResourceItem";

import {
  printOrders,
  STATUS_CHECKS,
} from "../../lib/utility";

import type {
  Resource,
  ViewType,
} from "../../types";

type Props = {
  fetchExams: (resourceGroup: string, resourceIds: Array<number>, date?: number) => void,
  filterOrders: (search: string) => void,
  resources: {[string]: Array<Resource>},
  selectedResourceGroup: string,
  selectedDate: string,
  viewType: ViewType,
  updateDate: (date: moment) => void,
  updateSelectedResourceGroup: (resources: {[string]: Array<Resource>}, selectedResourceGroup: string) => void,
}

type State = {
  showDatePicker: boolean,
}

class ViewControls extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showDatePicker: false,
    }
  }

  onChangeFilter = ({target}: SyntheticInputEvent<HTMLInputElement>) => {
    this.props.filterOrders(target.value);
  }

  render() {
    return (
      <div id="view-controls">
        <div className="btn-group pull-left">
          <button className="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" id="legend-button">Legend <span className="caret"></span></button>
          {this.renderLegend()}
        </div>
        {this.renderSearchFilter()}

        {this.renderDatePicker()}
        {this.renderResourceDropdown()}
        {this.renderPrintButton()}
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

  renderSearchFilter() {
    const {viewType} = this.props;
    if (viewType === "kiosk") {return null}
    return (
      <div className="input-group pull-left col-xs-2 form-group-sm margin-left-sm">
        <input type="text" className="form-control" id="search-field" placeholder="Search" onChange={this.onChangeFilter} />
        <div className="input-group-addon"><i className="fa fa-search"></i></div>
      </div>
    );
  }

  renderStatus(status: Object) {
    return (
      <div key={`status-${status.order}`} className="status">
        <span className="color" style={{backgroundColor: status.color}}></span><span className="name">{status.name}</span>
      </div>
    )
  }

  renderDatePicker() {
    const {viewType} = this.props;
    if (viewType === "kiosk") {return null}
    const date = this.dateAsMoment();
    return (
      <div className="btn-group pull-right">
        <SingleDatePicker
          date={date}
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
    const {resources, selectedResourceGroup} = this.props;
    return (
      <div className="btn-group pull-right margin-right-sm" id="resource-group-buttons">
        <button className="btn btn-default btn-sm dropdown-toggle" data-value={selectedResourceGroup} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span className="group-name">{selectedResourceGroup} </span>
          <span className="caret"></span>
        </button>
        <ul className="dropdown-menu">
          {R.map(this.renderResource, R.keys(resources))}
        </ul>
      </div>
    )
  }

  renderResource = (resourceName: string) => (
    <ResourceItem
      key={`resource-listing-${resourceName}`}
      resources={this.props.resources}
      name={resourceName}
      onClick={this.selectResourceGroup}
    />
  )

  renderPrintButton() {
    const {viewType} = this.props;
    if (viewType === "kiosk") {return null}
    return (
      <div className="btn-group pull-right margin-right-sm" id="print-button">
        <button className="btn btn-default btn-sm" onClick={printOrders} title="Printer-friendly view">
          <i className="fa fa-print" aria-hidden="true"></i>
        </button>
      </div>
    )
  }

  selectResourceGroup = (resources: {[string]: Array<Resource>}, selectedResourceGroup: string) => {
    this.props.updateSelectedResourceGroup(resources, selectedResourceGroup);
    const resourceIds = R.map(R.prop("id"), this.props.resources[selectedResourceGroup]);
    this.fetchExams(selectedResourceGroup, {resourceIds});
  }

  selectDate = (date: moment) => {
    this.props.updateDate(date);
    this.fetchExams(this.props.selectedResourceGroup, {date});
  }

  toggleDatePicker = () => {
    this.setState({showDatePicker: !this.state.showDatePicker});
  }

  fetchExams = (selectedResourceGroup: string, {resourceIds, date}: {resourceIds?: Array<number>, date?: moment}) => {
    const resources = resourceIds || R.map(R.prop("id"), this.props.resources[this.props.selectedResourceGroup]);
    const selectedDate = date ? date.unix() : this.dateAsMoment().unix();
    this.props.fetchExams(selectedResourceGroup,  resources, selectedDate);
  }

  dateAsMoment(): moment {
    // Ensures that the date in use is a moment.
    const {selectedDate} = this.props;
    return moment.isMoment(selectedDate) ? selectedDate : moment(selectedDate);
  }
}

export default ViewControls;
