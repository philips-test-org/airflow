// @flow

import React, {PureComponent} from "react";

type Props = {
  handleClick: () => void,
  className: string,
  text: string,
}

class Button extends PureComponent<Props> {
  render() {
    const {className, handleClick, text} = this.props;
    return (
      <div className={`btn ${className}`} onClick={handleClick}>{text}</div>
    );
  }
}

export default Button;
