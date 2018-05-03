// @flow

import React, {PureComponent} from "react";
import * as R from "ramda";

import {
  cardStatuses,
  checkExamThenOrder,
  formatName,
} from "../../lib/utility";

import type {Order} from "../../types";

type Props = {
  orders: Order,
};

class PrintView extends PureComponent {
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
        <div key={`print-lane-${resourceName}`}>
          <h1>{resourceName}</h1>
          <hr />
          {this.renderOrders(orders)}
        </div>
      )
  }

  renderOrders(orders: Array<Order>) {
    const patientPath = ["site_class", "patient_type", "patient_type"];
    return R.map(this.renderOrder, R.flatten(R.values(this.props.orders)))
  }

  renderOrder = (order: Order) => (
    <div key={order.id}>
      <h3 className="patient-name">{this.name(order)}</h3>
      <dl>
        <dt>Procedure:</dt>
        <dd className="procedure">{checkExamThenOrder(order, ["procedure", "description"])}</dd>
        <dt>Ordering Physician:</dt>
        <dd>{R.path(["rad_exam", "rad_exam_personnel", "ordering", "name"], order)}</dd>
        <dt>Rounding:</dt>
        <dd>{this.rounding(order)}</dd>
        <hr />
      </dl>
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
