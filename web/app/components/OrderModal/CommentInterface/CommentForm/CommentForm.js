// @flow

import React, {Component} from "react";
import * as R from "ramda";

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

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return !R.equals(nextProps, this.props) || !R.equals(nextState, this.state);
  }

  render() {
    return (
      <form>
        <div className="comment">
          <div className="avatar">
            <img className="avatar" src={`/avatar/${this.props.userId}`} />
          </div>
          <div className="body panel panel-default">
            <div className="panel-heading">
              <h5>Add comment to the order</h5>
            </div>
            <div className="panel-body">
              <textarea
                name="comments"
                className="form-control comment-box"
                autoFocus
                onChange={this.updateComment}
                value={this.state.comment}
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

  updateComment = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const comment = event.target.value;
    this.setState({comment: comment})
  }

  handleSubmit = () => {
    if (this.state.comment !== "") {
      this.props.handleSubmit(this.state.comment);
      this.setState({comment: ""});
    }
  }
}

export default CommentForm;
