// @flow

import React, {PureComponent} from "react";
import * as R from "ramda";
import moment from "moment";

import SingleDatePicker from "react-dates/lib/components/SingleDatePicker";

import ResourceItem from "./ResourceItem";
import {withTranslation} from "react-i18next";
import {
  STATUS_CHECKS,
  printOrders,
} from "../../lib";

import type {
  Resource,
  ViewType,
} from "../../types";

type Props = {
  fetchExams: (resourceGroup: string, resourceIds: Array<number>, date?: number) => void,
  filterOrders: (search: string) => void,
  resources: {[string]: Array<Resource>},
  selectedResourceGroup: string,
  selectedResources: {[number]: string},
  selectedDate: string,
  viewType: ViewType,
  updateDate: (date: moment) => void,
  updateSelectedResourceGroup: (resources: {[string]: Array<Resource>}, selectedResourceGroup: string) => void,
  t:(label: string) =>string
}

type State = {
  showDatePicker: boolean,
}

class ViewControls extends PureComponent<Props, State> {
  searchInput: Object;

  constructor(props: Props) {
    super(props);

    this.searchInput = React.createRef();
    this.state = {
      showDatePicker: false,
    }
  }

  componentDidUpdate(prevProps: Props) {
    const {viewType: newType} = this.props;
    const {viewType: oldType} = prevProps;
    if (oldType !== newType) {
      // Reset Search
      this.clearSearch();
    }
  }

  onChangeFilter = ({target}: SyntheticInputEvent<HTMLInputElement>) => {
    this.props.filterOrders(target.value);
  }

  clearSearch = () => {
    if (this.searchInput && this.searchInput.current) {
      this.searchInput.current.value = "";
    }
    this.props.filterOrders("");
  }

  render() {
    return (
      <div id="view-controls">
        <div className="btn-group pull-left">
          <button className="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" id="legend-button">{this.props.t('LABEL_LEGEND')}<span className="caret"></span></button>
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
        <h3 className="popover-title">{this.props.t('LABEL_LEGEND')}</h3>
        <div className="popover-content" style = {{width: "max-content"}} >
          {R.map(this.renderStatus.bind(this), STATUS_CHECKS)}
          <div className="status">
            <span className="color icon"><i className="anesthesia">A</i></span><span className="name">{this.props.t('LABEL_ANESTHESIA')}</span>
          </div>
          <div className="status">
            <span className="color icon"><i className="fa fa-handshake-o"></i></span><span className="name">{this.props.t('LABEL_CONSENT')}</span>
          </div>
          <div className="status">
            <span className="color icon"><i className="fa fa-thumbs-up"></i></span><span className="name">{this.props.t('LABEL_PPCAARRIVAL')}</span>
          </div>
          <div className="status">
            <span className="color icon"><i className="fa fa-file-text"></i></span><span className="name">{this.props.t('LABEL_PAPERWORK')}</span>
          </div>
          <div className="status">
            <span className="color"><i className="fa fa-paperclip"></i></span><span className="name">{this.props.t('LABEL_COMMENT_1')}</span>
          </div>
        </div>
      </div>
    )
  }

  renderSearchFilter() {
    const {viewType} = this.props;
    if (viewType === "kiosk") {return null}
    return (
      <div className="input-group pull-left col-xs-4 form-group-sm margin-left-sm hidden-xs">
        <input type="text" className="form-control" id="search-field" ref={this.searchInput} placeholder={this.props.t('LABEL_SEARCH')} onChange={this.onChangeFilter} />
        <div className="input-group-addon clickable" onClick={this.clearSearch}><i className="fa fa-times"></i></div>
      </div>
    );
  }

  renderStatus(status: Object) {
    return (
      <div key={`status-${status.order}`} className="status">
        <span className="color" style={{backgroundColor: status.color}}></span><span className="name">{this.props.t(`LABEL_${status.name.toUpperCase().replace(/\s/g, '')}`)}</span>
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
          placeholder={this.props.t('MESSAGE_TODAY')}
          readOnly={true}
          small={true}
          hideKeyboardShortcutsPanel= {true}
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
        <button className="btn btn-default btn-sm" onClick={this.printOrders} title={this.props.t('TITLE_PRINTER_FRIENDLY')}>
          <i className="fa fa-print" aria-hidden="true"></i>
        </button>
      </div>
    )
  }

  printOrders = () => {
    const resourceIds = R.keys(this.props.selectedResources);
    const date = this.props.selectedDate;
    printOrders(date, resourceIds, this.props.selectedResourceGroup);
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
    const {selectedDate}: {selectedDate: moment} = this.props;
    return moment.isMoment(selectedDate) ? selectedDate.startOf("day") : moment(selectedDate).startOf("day");
  }
}

export default withTranslation()(ViewControls);
