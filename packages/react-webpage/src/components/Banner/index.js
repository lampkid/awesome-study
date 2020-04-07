import React, { PureComponent } from 'react';

import './index.less';

import banner from '../../banner.jpg';

export default class Banner extends PureComponent {
  render() {
    const { children, banner:bannerBg = banner } = this.props;
    return (
      <div className="banner">
        <div className="bg" style={{ backgroundImage: `url(${ bannerBg })`}}></div>
        <div className="mask"></div>
        <div className="banner-content">
          { children }
        </div>
      </div>
    );
  }
}
