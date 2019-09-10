// @flow

import React, {PureComponent} from "react";
import * as R from "ramda";
import {withTranslation} from "react-i18next";

import {
  avatarPath,
  formatTimestamp,
} from "../../../../lib";

import type {
  User,
} from "../../../../types";

type Props = {
  employee: User,
  comments: string,
  created_at: string,
  hideAvatar: boolean,
  showOrderNumber: boolean,
  orderNumber: string,
  orderNumbers: Array<string>,
  t:(label: string) =>string
}

class Comment extends PureComponent<Props> {
  static defaultProps: {hideAvatar: boolean}

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
          <div className="heading">
            <strong>{employee.name}</strong> {this.props.t('LABEL_COMMENTEDON')} <span className="time short">{formatTimestamp(created_at)}</span> {R.prop("merged", this.props) ? <i className="fa fa-compress"></i> : null}
            {this.props.showOrderNumber && this.renderOrderNumber()}
          </div>
          <div className="content">{comments}</div>
        </div>
      </div>
    );
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

Comment.defaultProps = {hideAvatar: false}

export default withTranslation()(Comment);
