// @flow

import React, {Component} from "react";

import Button from "../../../Common/Button";

type Props = {
  userId: number,
  handleSubmit: (comment: string) => void,
}

type State = {
  comment: string,
}

class CommentForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      comment: "",
    };
  }

  render() {
    return (
      <form>
        <div className="comment">
          <div className="avatar">
            <img className="avatar" src={`/avatar/${this.props.userId}`} />
          </div>
          <div className="body">
            <div className="heading form">
              Add comment to the order:
            </div>
            <div className="content">
              <textarea
                name="comments"
                className="form-control comment-box"
                autoFocus
                onChange={this.updateComment}
                value={this.state.comment}
              />
            </div>
            <div className="footer">
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

  updateComment = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const comment = event.target.value;
    this.setState({comment: comment})
  }

  handleSubmit = () => {
    this.props.handleSubmit(this.state.comment);
    this.setState({comment: ""});
  }
}

export default CommentForm;
