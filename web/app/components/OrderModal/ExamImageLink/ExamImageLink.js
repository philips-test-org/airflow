// @flow

import React, {Component} from "react";
import * as R from "ramda";

import {formatTimestamp} from "../../../lib";

import type {
  ImageViewer,
  IntegrationJson,
} from "../../../types";

type Props = {
  description: string,
  time: number,
  imageViewer: ImageViewer,
  integrationJson: IntegrationJson,
  viewImage: (imageViewer: ImageViewer, integrationJson: IntegrationJson) => void,
}

class ExamImageLink extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return !R.equals(nextProps, this.props);
  }

  render() {
    const {description, time} = this.props;
    return (
      <li><a href="#" onClick={this.viewImage}>
        {description || "Exam"}
        <br />
        {formatTimestamp(time)}
      </a></li>
    );
  }

  viewImage = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const {imageViewer, integrationJson} = this.props;
    this.props.viewImage(imageViewer, integrationJson);
  }
}

export default ExamImageLink;

