import React, { PureComponent } from 'react';

import './index.less';

export default class Card extends PureComponent {
  render() {
    const { image, title, description } = this.props;

    return (
      <div className="card">
        <img alt="暂时无法访问" src={image} width="100%" />
        <h3>{ title }</h3>
        <p>{ description }</p>
      </div>
    );
  }
}
