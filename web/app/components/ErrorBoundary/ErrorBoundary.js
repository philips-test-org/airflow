// @flow
import * as React from "react";
import * as R from "ramda";

type Props = {
  id: string,
  children?: React.Node,
}

type State = {
  errors: ?Error,
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props);
    this.state = {
      errors: null,
    };
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return !R.equals(nextProps, this.props) || !R.equals(nextState, this.state);
  }

  componentDidCatch(errors: Error) {
    this.setState({ errors });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div id={this.props.id}>
          <p>Something went wrong.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
