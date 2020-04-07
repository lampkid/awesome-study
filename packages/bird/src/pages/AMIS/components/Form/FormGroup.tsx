import React from "react";

import { Form, Icon, Tooltip } from "antd";
import Ipt from "../Ipt";
import { transformRules } from "./validator";
import { FormItemProps } from "antd/lib/form";

const FormItem = Form.Item;

const FORM_ITEM_LAYOUT = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};
export interface IFormItemProps extends FormItemProps {
  key: string;
  type: string;
  display?: boolea;
  title: string;
  rules: [];
  defaultValue?: any;
  extra?: string | { tip: string; icon: string };
  layout?: string;
  formItemLayout?: { [key: string]: any };
  options?: {};
  provider: string | [];
  labelTip: string;
}

export default FormGroup;

function FormGroup({
  fields = [],
  provider = {},
  layout,
  style,
  disabled,
  form: { getFieldDecorator },
  formItemLayout: propFormItemLayout = {},
  values = {},
  children
}) {
  let groupFormItemLayout = propFormItemLayout;
  if (layout === "horizontal") {
    groupFormItemLayout = { ...FORM_ITEM_LAYOUT, ...propFormItemLayout };
  }
  const formItems = fields.map(
    (
      {
        key,
        type = "text",
        display,
        title,
        label = title,
        rules = [],
        defaultValue,
        options,
        provider: providerKey,
        layout: iptLayout = "vertical",
        formItemLayout = groupFormItemLayout,
        extra,
        labelTip,
        colon,
        linkage = {},
        ...otherIptProps
      }: IFormItemProps,
      index
    ) => {
      if (display === false) {
        return;
      }

      const {
        key: linkageKey,
        type: linkageType,
        value: linkageValue
      } = linkage;
      if (linkageType === "display" && values[linkageKey] !== linkageValue) {
        return;
      }

      const { style } = formItemLayout;
      const formItemProps: Partial<FormItemProps> = {
        style: type === "hidden" ? { display: "none" } : { ...style }
      };

      const separator = colon !== false && ":";

      const formItemLabel = label ? (
        <span>
          {label}
          {labelTip ? (
            <span className="form-item-label-tip">
              {labelTip.mode === "exposed" ? (
                <span className="exposed">
                  {separator}
                  <Icon type="info-circle" /> {labelTip.tip}
                </span>
              ) : (
                <span className="popup">
                  <Tooltip title={labelTip}>
                    <Icon type="info-circle" />
                  </Tooltip>
                  {separator}
                </span>
              )}
            </span>
          ) : (
            separator
          )}
        </span>
      ) : (
        label
      );

      // collect iptProps
      const iptProps = {
        type
      };

      if (options) {
        Object.assign(iptProps, {
          options
        });
      }
      if (providerKey) {
        let providerObj = {};
        if (Array.isArray(providerKey)) {
          for (let key of providerKey) {
            providerObj[key] = provider[key];
          }
          Object.assign(iptProps, {
            options: providerObj
          });
        } else {
          Object.assign(iptProps, {
            options: provider[providerKey] || {}
          });
        }
      }

      return (
        <FormItem
          key={index}
          label={formItemLabel}
          className={`x-form-item-${iptLayout}`}
          {...groupFormItemLayout}
          {...formItemLayout}
          {...formItemProps}
          colon={false}
        >
          {getFieldDecorator(key, {
            initialValue: defaultValue,
            rules: transformRules(rules || [])
          })(
            <Ipt
              disabled={disabled}
              extra={extra}
              {...iptProps}
              {...otherIptProps}
            />
          )}
        </FormItem>
      );
    }
  );

  return (
    <div className={`form-group-${layout}`} style={...style}>
      {formItems}
      {children}
    </div>
  );
}
