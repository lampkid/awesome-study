import React from 'react';

import './index.less';

function Title ({title, children, style, preStyle}) {
    //todo 支持问号tip
    //todo 支持后面有灰横线
    //todo 支持颜色配置、字体配置，可设定几种大小，如传xl, large、small, xs等
    return (
        <div className="x-title" style={style}> 
            <div className="x-title-pre" style={{preStyle}}></div>
            {title || children}
        </div>
    );
}

export default Title;
