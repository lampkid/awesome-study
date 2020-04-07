import React, { PureComponent } from 'react';

import './index.less';

export default class Panel extends PureComponent {
  render() {
    const { links = [], cols = 2, md = cols, copyright: { text, note } = {} } = this.props;
    const mdSpans = Math.floor(12.0 / md);

    return (
      <div className="footer">
        <div className="container">
          <div className="links">
            <div className="row clearfix">
                {
                  links.map( (linkGroup, groupIndex) => {
                    const { title: groupTitle, links: groupLinks = [] } = linkGroup;
                    return (
                      <div key={groupIndex} className={`col-xs-6 col-md-${mdSpans}`}>
                        <h6>{ groupTitle }</h6>
                        <ul>
                        {
                          groupLinks.map((link, index) => {
                            const { url, title: linkLabel } = link;
                            return (
                              <li>
                                <a className="link-text" href={url}>{ linkLabel }</a>
                              </li>
                            );
                          })
                        }
                        </ul>
                      </div>
                    );
                  })
                }
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row clearfix">
            <div className="copyright">
              <div className="col-xs-12 col-sm-6"><div className="copyright-left">© { text }</div></div>
              <div className="col-xs-12 col-sm-6"><div className="copyright-right">{ note }</div></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
