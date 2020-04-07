import React from "react";
import { Button as AntdButton } from "antd";
import Popconfirm from "../../Popconfirm";
import classnames from "classnames";
import "./index.less";

const prefixCls = `x-btn-group`;

export default class ButtonGroup extends React.Component {
  renderButtons(btns) {
    return btns.map((item, index) => {
      if (!item) return;
      const {
        key = index,
        title,
        label = title,
        type = "default",
        display,
        confirm = false,
        disabled = false,
        onClick,
        ...otherBtnProps
      } = item;
      if (display !== false) {
        const btn = (
          <AntdButton
            key={key}
            type={type}
            disabled={disabled}
            onClick={!confirm && onClick}
            {...otherBtnProps}
          >
            {label}
          </AntdButton>
        );

        if (confirm) {
          return (
            <Popconfirm
              key={key}
              title={
                typeof confirm === "boolean"
                  ? `确定执行${label}操作吗？`
                  : confirm
              }
              onConfirm={onClick}
            >
              {btn}
            </Popconfirm>
          );
        }
        return btn;
      }
      return null;
    });
  }

  render() {
    const { className, style, btns } = this.props;

    const cls = classnames(className, prefixCls);

    return (
      <div className={cls} style={style}>
        {this.renderButtons(btns)}
      </div>
    );
  }
}
