// @flow
declare var $: any;

import React, {Component, Fragment} from "react";
import * as R from "ramda";

import {
  cardStatuses,
  formatName,
  kioskNumber,
  wrapEvent,
} from "../../lib";

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
  adjustOrder: (event: Object, id: string | number) => void,
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
  order: Order,
  showMoreImages: boolean,
}

class OrderModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const order = props.order.merged ? props.order.orders[0] : props.order;

    this.state = {
      order,
      showMoreImages: false,
    };
  }

  static getDerivedStateFromProps({order: nextOrder}: Props) {
    const order = nextOrder.merged ? nextOrder.orders[0] : nextOrder;
    return {order};
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return !R.equals(nextProps, this.props) || !R.equals(nextState, this.state);
  }

  render() {
    const {avatarMap, currentUser} = this.props;
    const {order} = this.state;
    const cardColor = this.cardColor();
    const userAvatar = avatarMap[currentUser.id];
    const roundingValue = R.find(R.propEq("event_type", "rounding-update"), order.events);
    const events = this.assocEventsWithOrderNumber();
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
                    <ExamDemographics
                      order={order}
                      orderGroup={this.props.orderGroup}
                      startDate={this.props.startDate}
                    />
                  </div>
                  <CommentInterface
                    avatar={userAvatar}
                    events={events}
                    fetchAvatar={this.props.fetchAvatar}
                    handleNewComment={this.handleNewComment}
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

  assocEventsWithOrderNumber() {
    if (this.props.order.merged) {
      return this.props.order.events;
    }
    const {events, order_number} = this.props.order;
    return R.map(R.assoc("orderNumber", order_number), events);
  }

  renderStatusToggles() {
    const {order: {adjusted}} = this.props;
    // Flipping and partially applying so that the parameter name
    // is the unapplied argument.
    const checkStatus = (param) => R.propEq(param, true, adjusted);
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

    const separator = <li role="separator" className="divider"></li>;
    return exams.map((exam, i) => (
      <Fragment key={i}>
        {!!i && separator}
        {exam}
      </Fragment>
    ));
  }

  cardColor() {
    const {order} = this.state;
    return R.has("cardStatus", order) ? R.path(["cardStatus", "color"], order) :
      cardStatuses(order, ["color"], {color: "#ddd"}).color;
  }

  viewImage = (imageViewer: ImageViewer, integrationJson: IntegrationJson) => {
    $.harbingerjs.integration.view(imageViewer, integrationJson);
  }

  id() {
    return this.props.order.merged ?
      this.props.orderGroup.reverse().map(order => order.id).join("-") :
      this.props.order.id;
  }

  handleStatusChange = (eventType: string, newState: Object) => {
    const {currentUser} = this.props;
    const id = this.id();
    this.props.adjustOrder(wrapEvent(id, currentUser.id, eventType, null, newState), id);
  }

  handleNewComment = (comment: string) => {
    const {currentUser} = this.props;
    const id = this.id();
    this.props.adjustOrder(wrapEvent(id, currentUser.id, "comment", comment, {}), id);
  }

  handleRoundingUpdate = (comment: string) => {
    const {currentUser} = this.props;
    const id = this.id();
    this.props.adjustOrder(wrapEvent(id, currentUser.id, "rounding-update", comment, {}), id);
  }

  closeModal = () => {
    this.props.closeModal();
  }
}

export default OrderModal;
