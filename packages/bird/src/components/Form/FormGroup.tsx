import React from 'react';

import { Form } from 'antd';
import Ipt from '../Ipt';
import { transformRules } from './validator';

const FormItem = Form.Item;

const FORM_ITEM_LAYOUT = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};

export default function FormGroup({
  fields = [],
  provider = {},
  layout,
  disabled,
  form: { getFieldDecorator },
  formItemLayout: propFormItemLayout = {},
  children
}) {
  let groupFormItemLayout = propFormItemLayout;
  if (layout === 'horizontal') {
    groupFormItemLayout = { ...FORM_ITEM_LAYOUT, ...propFormItemLayout }
  }
  const formItems = fields.map(({
    key,
    type = 'text',
    display,
    title,
    label = title,
    rules = [],
    defaultValue,
    options,
    provider: providerKey,
    layout: iptLayout = 'vertical',
    formItemLayout = groupFormItemLayout,
    ...otherIptProps
  }, index) => {

    if (display === false) {
      return;
    }
    const { style } = formItemLayout; // 对外暴漏为formItemProps是不是更好？
    const formItemProps = {
      style: type === 'hidden' ? { display: 'none' } : { ...style }
    };

    const formItemLabel = label;

    // collect iptProps
    const iptProps = {
      type,
    };

    if (options) {
      Object.assign(iptProps, {
        options
      });
    }
    if (providerKey) {
      Object.assign(iptProps, {
        options: provider[providerKey] || {}
      });
    }

    return (
      <FormItem 
        key={index}
        label={formItemLabel}
        className={`x-form-item-${iptLayout}`} 
        { ...groupFormItemLayout }
        { ...formItemLayout }
        { ...formItemProps }
      >
      {getFieldDecorator(key, {
        initialValue: defaultValue,
        rules: transformRules(rules) 
      })(<Ipt disabled={disabled} {...iptProps } { ...otherIptProps } />)} 
      </FormItem>
    );
  })

  return (
    <div className={`form-group-${layout}`}>
      {formItems}
      {children}
    </div>
  );
}
