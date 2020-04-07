import React, { PureComponent } from 'react';

import './index.less';

export default class Animation extends PureComponent {
  state = {
    animation: ''
  }

  componentDidMount() {
    const { action } = this.props;
    if (action) {
      this.setState({ animation: action });
    }
  }

  render() {
    const { children } = this.props;
    const { animation } = this.state;
    return (
      <div className={`animation ${animation}`}>
          { children }
      </div>
    );
  }
}
