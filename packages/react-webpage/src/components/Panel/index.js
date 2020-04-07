import React, { PureComponent } from 'react';

import './index.less';

export default class Panel extends PureComponent {
  render() {
    // 先支持一个Card每行列数一样的
    // at first we support the same cols in the diffrent rows
    // 每一行块应该叫做一个Panel，每一个Panel里有多个Card
    // TOPIC: row和col可以抽象为React组件xs={}, md={}
    const { title, children, cols = 2, md = cols, type: titleType = 'h2' } = this.props;
    const mdSpans = Math.floor(12.0 / md);
    // TODO: cols支持数组也支持数字, 先支持数字
    return (
      <div className="panel">
        <div className="container">
          <div className="row clearfix">
            <div className="col-xs-12">
              <h2 className={`panel-title ${titleType}`}>{ title }</h2>
            </div>
          </div>
          <div className="row clearfix">
              {
                React.Children.map(children, (child, index) => {
                  return (
                    <div key={index} className={`col-xs-12 col-md-${mdSpans}`}>
                      { child }
                    </div>
                  );
                })
              }
          </div>
        </div>
      </div>
    );
  }
}
