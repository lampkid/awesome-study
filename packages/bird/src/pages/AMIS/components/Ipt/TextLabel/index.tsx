import React from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import './index.less';

const clsPrefix = 'x';
const textLabelCls = `${clsPrefix}__text-label`;

function TextLabel({ children, style, className }) {
  return (
    <div className={classNames(textLabelCls, className)} style={style}>
      {children}
    </div>
  );
}

TextLabel.propTypes = {
  children: PropTypes.node,
  style: PropTypes.shape({}),
  className: PropTypes.string,
};

TextLabel.defaultProps = {
  children: '',
  style: {},
  className: '',
};

export default TextLabel;
