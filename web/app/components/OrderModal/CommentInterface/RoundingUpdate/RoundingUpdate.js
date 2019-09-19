// @flow

import React, {Component} from "react";
import * as R from "ramda";
import * as D from "diff";
import {withTranslation} from "react-i18next";

import {
  avatarPath,
  formatTimestamp,
} from "../../../../lib";

import Button from "../../../Common/Button";

import type {
  Event,
  User,
} from "../../../../types";

type Props = {
  employee: User,
  comments: string,
  created_at: string,
  lastUpdate: Event,
  hideAvatar: boolean,
  hideDiff: boolean,
  showOrderNumber: boolean,
  orderNumber: string,
  orderNumbers: Array<string>,
  t:(label: string) =>string
}

type State = {
  showDiff: boolean,
}

class RoundingUpdate extends Component<Props, State> {
  static defaultProps: {
    hideAvatar: boolean,
    hideDiff: boolean,
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      showDiff: false,
    }
  }

  render() {
    const {employee, created_at, comments, hideAvatar} = this.props
    const avatarSrc = avatarPath(employee.id);
    return (
      <div className="comment">
        {hideAvatar ? null :
          <div className="avatar">
            <img className="avatar" src={avatarSrc} />
          </div>
        }
        <div className="body">
          <div className="heading clearfix">
            <strong>{employee.name}</strong> {this.props.t('LABEL_UPDATEDROUNDING')} <span className="time short">{formatTimestamp(created_at)}</span> {R.prop("merged", this.props) ? <i className="fa fa-compress"></i> : null}
            {this.props.hideDiff ? null :
              <span className="pull-right">
                <Button text="Diff" className={`btn-xs btn-${this.state.showDiff ? "info" : "default"}`} handleClick={this.toggleDiff} />
              </span>
            }
            {this.props.showOrderNumber && this.renderOrderNumber()}
          </div>
          <div className="content">{this.state.showDiff ? this.renderDiff() : comments}</div>
        </div>
      </div>
    );
  }

  renderDiff() {
    const {comments, lastUpdate} = this.props;
    const commentDiff = D.diffWords(R.pathOr("", [0, "comments"], lastUpdate), comments);
    const idxMap = R.addIndex(R.map);
    return (
      idxMap((change, idx) => {
        const key = `diff-chunk-${idx}`;
        if (change.added) {
          return (<span key={key} style={{backgroundColor: "#ADFEB4"}}>{change.value}</span>);
        } else if (change.removed) {
          return (<span key={key} style={{backgroundColor: "#FFB7B9"}}>{change.value}</span>);
        }
        return (<span key={key}>{change.value}</span>);
      }, commentDiff)
    )
  }

  toggleDiff = () => {
    this.setState({showDiff: !this.state.showDiff});
  }

  renderOrderNumber() {
    const {orderNumber, orderNumbers} = this.props;
    let num;
    if (orderNumbers) {
      num = orderNumbers.join(", ");
    } else if (orderNumber) {
      num = orderNumber;
    } else {
      return null;
    }

    return (
      <div className="order-number">
        <strong>{this.props.t('LABEL_ORDER')}:</strong> {num}
      </div>
    );
  }
}

RoundingUpdate.defaultProps = {
  hideAvatar: false,
  hideDiff: false,
}

export default withTranslation()(RoundingUpdate);
