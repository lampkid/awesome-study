import React from "react";
// todo: Tooltip，Icon替换为自己的
import { Tooltip, Icon } from "antd";
import { IFormItemProps, HelpIcon } from "./index_d";

const PREFIX = "X";
import "./index.less";
export default function FormItem(props: IFormItemProps) {
  const {
    label,
    required,
    colon,
    help,
    helpIcon = HelpIcon.default,
    error,
    children,
    childrenLayout = "inline"
  } = props;
  return (
    <div className={`${PREFIX}-form-item`}>
      <label>
        {label}
        {required && <span className="required">*</span>}
        {help && (
          <Tooltip title={help}>
            <Icon type={helpIcon} />
          </Tooltip>
        )}
        {error && <span className="error">{error}</span>}
      </label>
      <div className={`children-${childrenLayout}`}>{children}</div>
    </div>
  );
}
