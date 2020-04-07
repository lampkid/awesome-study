import React from "react";
import { Icon, InputNumber as RcInputNumber } from "antd";

import classNames from "classnames";

export default class InputNumber extends React.Component {
  static defaultProps = {
    prefixCls: "ant-input-number",
    step: 1,
    addonAfter: ""
  };

  render() {
    const { className, size, addonAfter, ...others } = this.props;
    const inputNumberClass = classNames(
      {
        [`${this.props.prefixCls}-lg`]: size === "large",
        [`${this.props.prefixCls}-sm`]: size === "small"
      },
      className
    );
    const upIcon = (
      <Icon type="up" className={`${this.props.prefixCls}-handler-up-inner`} />
    );
    const downIcon = (
      <Icon
        type="down"
        className={`${this.props.prefixCls}-handler-down-inner`}
      />
    );

    return (
      <div>
        <RcInputNumber
          ref={c => (this.inputNumberRef = c)}
          placeholder={`请输入`}
          className={inputNumberClass}
          upHandler={upIcon}
          downHandler={downIcon}
          {...others}
        />
        {addonAfter ? (
          <span
            style={{
              paddingLeft: 5
            }}
          >
            {addonAfter}
          </span>
        ) : null}
      </div>
    );
  }

  focus() {
    this.inputNumberRef.focus();
  }

  blur() {
    this.inputNumberRef.blur();
  }
}
