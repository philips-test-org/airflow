// @flow

import React, {PureComponent} from "react";

import type {Resource} from "../../types";

type Props = {
  onClick: (resources: {[string]: Array<Resource>}, name: string) => void,
  name: string,
  resources: {[string]: Array<Resource>},
}

class ResourceItem extends PureComponent<Props> {
  onClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    this.props.onClick(this.props.resources, this.props.name);
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
