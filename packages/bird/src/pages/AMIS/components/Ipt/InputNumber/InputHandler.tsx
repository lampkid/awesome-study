/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Touchable from 'rmc-feedback';

class InputHandler extends Component {
  render() {
    const {
      prefixCls, disabled, onTouchStart, onTouchEnd,
      onMouseDown, onMouseUp, onMouseLeave, ...otherProps
    } = this.props;
    return (
      <span // 换成touchable onMouseDown好像没触发
        disabled={disabled}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        activeClassName={`${prefixCls}-handler-active`}
      >
        <span {...otherProps} />
      </span>
    );
  }
}

InputHandler.propTypes = {
  prefixCls: PropTypes.string,
  disabled: PropTypes.bool,
  onTouchStart: PropTypes.func,
  onTouchEnd: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

export default InputHandler;
