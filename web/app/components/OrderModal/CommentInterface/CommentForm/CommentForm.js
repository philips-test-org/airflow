// @flow

import React, {Component} from "react";
import * as R from "ramda";

import {avatarPath} from "../../../../lib";

import Button from "../../../Common/Button";

type Props = {
  userId: number,
  handleSubmit: (comment: string) => void,
}

class CommentForm extends Component<Props> {
  commentField: ?HTMLTextAreaElement;
  constructor(props: Props) {
    super(props);
  }

  shouldComponentUpdate(nextProps: Props) {
    return !R.equals(nextProps, this.props);
  }

  render() {
    const avatarSrc = avatarPath(this.props.userId);
    return (
      <form>
        <div className="comment">
          <div className="avatar">
            <img className="avatar" src={avatarSrc} />
          </div>
          <div className="body panel panel-default">
            <div className="panel-heading">
              <h5>Add comment to the order</h5>
            </div>
            <div className="panel-body">
              <textarea
                name="comments"
                className="form-control comment-box"
                ref={el => this.commentField = el}
              />
            </div>
            <div className="panel-footer">
              <div className="pull-right">
                <Button
                  className="btn-default add-comment"
                  handleClick={this.handleSubmit}
                  text="Add Comment"
                />
              </div>
              <div style={{clear: "both"}}></div>
            </div>
          </div>
        </div>
      </form>
    );
  }

  handleSubmit = () => {
    if (this.commentField && this.commentField.value !== "") {
      this.props.handleSubmit(this.commentField.value);
      if (this.commentField) this.commentField.value = "";
    }
  }
}

export default CommentForm;
