// @flow
declare var $: any;

import React, {Component} from "react";
import * as R from "ramda";

import {
  cardStatuses,
  formatName,
  kioskNumber,
} from "../../lib/utility";

import {
  wrapEvent,
} from "../../lib/data";

import CommentInterface from "./CommentInterface";
import RoundingInterface from "./RoundingInterface";
import StatusToggle from "./StatusToggle";
import ExamImageLink from "./ExamImageLink";
import ExamDemographics from "./ExamDemographics";

import type {
  ImageViewer,
  IntegrationJson,
  Order,
  RadExam,
  User,
} from "../../types";

type Props = {
  adjustOrder: (event: Object) => void,
  avatarMap: {[number]: Blob},
  closeModal: () => void,
  currentUser: User,
  exams: Array<RadExam>,
  fetchAvatar: (userId: number) => void,
  order: Order,
  orderGroup: Array<Order>,
  resourceMap: {[string]: string},
  startDate: number,
}

type State = {
  selectedOrder: number,
  showMoreImages: boolean,
}

class OrderModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedOrder: props.order.id,
      showMoreImages: false,
    };
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return !R.equals(nextProps, this.props) || !R.equals(nextState, this.state);
  }

  render() {
    const {order, avatarMap, currentUser} = this.props;
    const cardColor = cardStatuses(order, "color", "#ddd");
    const userAvatar = avatarMap[currentUser.id];
    const roundingValue = R.find(R.propEq("event_type", "rounding-update"), order.events);
    return (
      <div id="order-modal" className="modal fade in modal-open" tabIndex="-1" role="dialog" style={{display: "block"}}>
        <div className="modal-dialog modal-wide" role="document">
          <div className="modal-content">
            <div className="left-stripe" style={{backgroundColor: cardColor}}></div>
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.closeModal}><span aria-hidden="true">&times;</span></button>
              <div className="status-toggles">
                {this.renderStatusToggles()}
              </div>
              <h4 className="modal-title">{formatName(order.patient_mrn.patient.name)}</h4>
              <div className="clearfix modal-subhead">
                <h5 className="left">Kiosk Number: {kioskNumber(order.id)}</h5>
                {this.renderImages()}
              </div>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-xs-6">
                    <RoundingInterface handleSubmit={this.handleRoundingUpdate} rounding={roundingValue} />
                    <ul className="order-tabs nav nav-tabs nav-bottom-margin" role="tablist">
                      {this.renderOrderNavTabs()}
                    </ul>
                    <div className="tab-content">
                      {this.renderOrderTabPanel()}
                    </div>
                  </div>
                  <CommentInterface
                    avatar={userAvatar}
                    events={order.events}
                    fetchAvatar={this.props.fetchAvatar}
                    handleNewComment={this.handleNewComment}
                    orderId={order.id}
                    resourceMap={this.props.resourceMap}
                    user={this.props.currentUser}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderStatusToggles() {
    const {order: {adjusted}} = this.props;
    // Flipping and partially applying so that the parameter name
    // is the unapplied argument.
    const checkStatus = R.flip(R.flip(R.propEq)(true))(adjusted);
    const toggles = [
      {label: "On Hold", name: "onhold", faClass: "fa-hand-paper-o", isActive: checkStatus("onhold")},
      {label: "Anesthesia", name: "anesthesia", faClass: "GA", isActive: checkStatus("anesthesia")},
      {label: "Consent", name: "consent", faClass: "fa-handshake-o", isActive: checkStatus("consent")},
      {label: "PPCA Arrival", name: "ppca_arrival", faClass: "fa-thumbs-o-up", isActive: checkStatus("ppca_arrival")},
      {label: "PPCA Ready", name: "ppca_ready", faClass: "fa-check-circle-o", isActive: checkStatus("ppca_ready")},
      {label: "Paperwork", name: "paperwork", faClass: "fa-file-text", isActive: checkStatus("paperwork")},
    ];
    return R.addIndex(R.map)((toggle, index) => (
      <StatusToggle
        key={`order-panel-${index}`}
        handleChange={this.handleStatusChange}
        {...toggle} />
    ), toggles);
  }

  renderOrderNavTabs() {
    const {selectedOrder} = this.state;
    return (
      R.map((order) => {
        const className = `order-nav ${R.equals(order.id, selectedOrder) ? "active" : ""}`;
        return (
          <li key={`${order.id}-nav-panel`} role="presentation" className={className}>
            <a href={`#order-content-${order.id}`}
              id={`nav-${order.id}`}
              aria-controls="home"
              role="tab"
              onClick={() => {this.handleOrderNavClick(order.id)}}
            >{order.order_number}</a>
          </li>
        );
      }, this.props.orderGroup)
    );
  }

  handleOrderNavClick(id: number) {
    this.setState({selectedOrder: id});
  }

  renderOrderTabPanel() {
    const order = R.find(R.propEq("id", this.state.selectedOrder), this.props.orderGroup);
    return (
      <ExamDemographics order={order} startDate={this.props.startDate} />
    )
  }

  renderImages() {
    const {exams} = this.props;

    if (!exams || exams.length <= 0) return;

    const firstExam = R.head(exams);

    return (
      <div className="btn-group pacs-dropdown right">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => this.viewImage(firstExam.image_viewer, firstExam.integration_json)}
        >
          View Most Recent Image
        </button>
        <button type="button" className="btn btn-primary dropdown-toggle btn-sm" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span className="caret"></span>
          <span className="sr-only">Toggle Dropdown</span>
        </button>
        <ul className="dropdown-menu">{this.renderExamImagesList()}</ul>
      </div>
    );
  }

  renderExamImagesList() {
    const exams = this.props.exams.map(exam => (
      <ExamImageLink
        key={exam.id}
        description={R.path(["procedure", "description"], exam)}
        time={R.path(["rad_exam_time", "end_exam"], exam)}
        imageViewer={exam.image_viewer}
        integrationJson={exam.integration_json}
        viewImage={this.viewImage}
      />
    ));
    const divider = <li key="separator" role="separator" className="divider"></li>;
    return R.intersperse(divider, exams);
  }

  viewImage = (imageViewer: ImageViewer, integrationJson: IntegrationJson) => {
    $.harbingerjs.integration.view(imageViewer, integrationJson);
  }

  handleStatusChange = (eventType: string, newState: Object) => {
    const {order, currentUser} = this.props;
    this.props.adjustOrder(wrapEvent(order.id, currentUser.id, eventType, null, newState));
  }

  handleNewComment = (comment: string) => {
    const {order, currentUser} = this.props;
    this.props.adjustOrder(wrapEvent(order.id, currentUser.id, "comment", comment, {}));
  }

  handleRoundingUpdate = (comment: string) => {
    const {order, currentUser} = this.props;
    this.props.adjustOrder(wrapEvent(order.id, currentUser.id, "rounding-update", comment, {}));
  }

  closeModal = () => {
    this.props.closeModal();
  }
}

export default OrderModal;
