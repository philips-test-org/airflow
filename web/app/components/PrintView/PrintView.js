// @flow

import React, {Component} from "react";
import * as R from "ramda";

import {
  checkExamThenOrder,
  formatName,
} from "../../lib/utility";

import type {Order} from "../../types";

type Props = {
  orders: Order,
  selectedResources: {[number]: string},
};

class PrintView extends Component<Props> {
  shouldComponentUpdate(newProps: Props) {
    return !R.equals(this.props, newProps);
  }

  render() {
    const printContent = R.map(
      ([resourceId, orders]) => this.renderLane(resourceId, orders),
      R.toPairs(this.props.orders)
    );

    return (
      <div className="print-view">
        <div id="print-view-contents">
          {printContent}
        </div>
        <iframe id="print-view-frame"></iframe>
      </div>
    );
  }

  renderLane(resourceId: number, orders: Array<Order>) {
    const resourceName = this.props.selectedResources[resourceId];
    return (
      <div key={`print-lane-${resourceName}`} style={{pageBreakAfter: "always"}}>
        <h2>{resourceName}</h2>
        <hr />
        {this.renderOrders(orders)}
      </div>
    )
  }

  renderOrders = (orders: Array<Order>) => (
    R.map(this.renderOrder, R.flatten(R.values(orders)))
  )

  renderOrder = (order: Order) => (
    <div key={order.id} className="print-order" style={{pageBreakInside: "avoid", marginBottom: "1em"}}>
      <h3 className="patient-name">{this.name(order)}</h3>
      <div>
        <div>
          <strong>Procedure: </strong>
          <span className="procedure">{checkExamThenOrder(order, ["procedure", "description"])}</span>
        </div>
        <div>
          <strong>Ordering Physician: </strong>
          <span>{R.path(["rad_exam", "rad_exam_personnel", "ordering", "name"], order)}</span>
        </div>
        <div>
          <strong>Rounding: </strong>
          <span>{this.rounding(order)}</span>
        </div>
      </div>
      <hr />
    </div>
  )

  name = (order: Order) => {
    const patientName = R.path(["patient_mrn", "patient", "name"], order);
    if (!patientName) {return null}
    return formatName(patientName);
  }

  rounding = ({events}: Order) => {
    const roundingEvent = R.find(R.propEq("event_type", "rounding-update"), events);
    return R.pathOr("N/A", ["comments"], roundingEvent);
  }
}

export default PrintView;
