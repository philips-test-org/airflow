// @flow

import React, {PureComponent} from "react";

type Props = {
  onClick: (name: string) => void,
  name: string,
}

class ResourceItem extends PureComponent<Props> {
  onClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    this.props.onClick(this.props.name);
  }

  render() {
    const {name} = this.props;
    return (
      <li key={`resource-listing-${name}`} onClick={this.onClick}>
        <a href="#">{name}</a>
      </li>
    );
  }
}

export default ResourceItem;
