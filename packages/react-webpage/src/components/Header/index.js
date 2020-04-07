import React, { PureComponent } from 'react';

import './index.less';

import logo from '../../logo.svg';

export default class Header extends PureComponent {
  render() {
    const { title, logo: siteLogo = logo, navs = [] } = this.props;
    return (
      <header className="navbar" role="banner">
        <div className="container">
          <div className="navbar-left">
            <a className="navbar-brand">
              <div className="navbar-brand-logo">{ siteLogo ? <img src={ siteLogo } alt="brand" title="goto main page" width={40} height={40} /> : null }</div>
              { title ? <span className={`navbar-brand-title`}>{ title }</span> : null }
            </a>
          </div>
          <nav className="navbar-right">
            <ul>
            {
              navs.map((nav, index) => {
                const { title, to } = nav;
                return (
                  <li key={index}>
                    <a href={ to }><span>{ title }</span></a>
                  </li>
                );
              })
            }
            </ul>
          </nav>
        </div>
      </header>
    );
  }
}
