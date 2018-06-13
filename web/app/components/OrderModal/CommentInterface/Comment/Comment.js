// @flow

import React, {PureComponent} from "react";
import * as R from "ramda";

import {formatTimestamp} from "../../../../lib";

import type {
  User,
} from "../../../../types";

type Props = {
  employee: User,
  comments: string,
  created_at: string,
  hideAvatar: boolean,
}

class Comment extends PureComponent<Props> {
  static defaultProps: {hideAvatar: boolean}

  render() {
    const {employee, created_at, comments, hideAvatar} = this.props
    return (
      <div className="comment">
        {hideAvatar ? null :
          <div className="avatar">
            <img className="avatar" src={`/avatar/${employee.id}`} />
          </div>
        }
        <div className="body">
          <div className="heading">
            <strong>{employee.name}</strong> commented on <span className="time short">{formatTimestamp(created_at)}</span> {R.prop("merged", this.props) ? <i className="fa fa-compress"></i> : null}
          </div>
          <div className="content">{comments}</div>
        </div>
      </div>
    );
  }
}

Comment.defaultProps = {hideAvatar: false}

export default Comment;
