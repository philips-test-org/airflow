// @flow
import React, {Component} from 'react';
import * as R from "ramda";

import NotecardLane from "../NotecardLane";

import type {
  Order,
  Resource,
} from "../../types";

type Props = {
  startDate: number,
  orders: {[string]: Array<Order>},
  resources: {[string]: Array<Resource>}
}

class Calendar extends Component {
  render() {
    const lanes = R.map(
      ([header, orders]) => this.renderLane(header, orders),
      R.toPairs(this.props.orders)
    );

    return (
      <div>
        <div id="board-headings">
          <div id="white-spacer">
          </div>

          <table id="time-headings">
            <tbody>
              <tr className="heading">
                <td></td>
                {R.map(this.renderHeading, R.keys(this.props.orders))}
              </tr>
            </tbody>
          </table>
        </div>

        <div id="board">
          <table id="vertical-time-headings">
            <tbody>
              <tr>
                <td>
                  {/* TODO ADD HOURS */}
                </td>
              </tr>
            </tbody>
          </table>

          <div id="right-now"></div>

          <table id="time-grid">
            <tbody>
              <tr>
                {lanes}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  renderHeading(resourceName) {
    return (
      <td><h1>{resourceName}</h1></td>
    )
  }

  renderLane(header, orders) {
    return (
      <td key={`${header}-lane`}>
        <NotecardLane
          orders={orders}
          type="calendar"
          />
      </td>
    )
  }
}

export default Calendar;
