// @flow
declare var $: any;

import React, {PureComponent} from "react";

import {formatTimestamp} from "../../../lib/utility";

import type {
  ImageViewer,
  IntegrationJson,
} from "../../../types";

type Props = {
  description: string,
  time: number,
  imageViewer: ImageViewer,
  integrationJson: IntegrationJson,
}

class ExamImageLink extends PureComponent<Props> {
  render() {
    const {description, time} = this.props;
    return (
      <div className="clearfix exam-image">
        <h5 className="left no-margin">
          {description}
          <br />
          <span className="small">{formatTimestamp(time)}</span>
        </h5>
        <button className="btn btn-primary btn-sm right" onClick={this.viewImage}>View Image</button>
      </div>
    );
  }

  viewImage = () => {
    const {imageViewer, integrationJson} = this.props;
    $.harbingerjs.integration.view(imageViewer, integrationJson);
  }
}

export default ExamImageLink;

