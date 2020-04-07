import React, { Children, cloneElement } from "react";

import _ from "lodash";

import { Form } from "antd";

import FormGroup from "./FormGroup";

import { transformRules } from "./validator";

import "./XForm.less";

/*
 * @prop fields [field]
 * * field:
 * {
 *  key: 'name',
 *  type: 'text',
 *  label: '名称',
 *  provider: '', // options里取选项的key, 如select
 *  layout: 'vertical'
 * }
 */

@Form.create({
  mapPropsToFields(props) {
    const { fields = [], data = {}, dataBased = false } = props;
    if (dataBased) {
      // 配合FormGroup的defaultValue, todo: 如何让FormGroup也支持mapPropsToFields?
      return Object.keys(data).reduce((prevFieldValueMap, key) => {
        return {
          ...prevFieldValueMap,
          [key]: Form.createFormField({
            value: _.get(data, key)
          })
        };
      }, {});
    }

    return fields.reduce((prevFieldValueMap, field) => {
      const { key } = field;
      const value = _.get(data, key);
      return {
        ...prevFieldValueMap,
        [key]: Form.createFormField({
          value // todo: 考虑嵌套字段
        })
      };
    }, {});
  },

  onFieldsChange(props, changedFields) {
    props.onFieldsChange && props.onFieldsChange(changedFields);
  },

  onValuesChange(props, values) {
    props.onChange && props.onChange(values);
  }
})
export default class XForm extends React.Component {
  static FormGroup: ({
    fields,
    provider,
    layout,
    disabled,
    form: { getFieldDecorator },
    formItemLayout: propFormItemLayout,
    children
  }: {
    fields?: never[] | undefined;
    provider?: {} | undefined;
    layout: any;
    disabled: any;
    form: { getFieldDecorator: any };
    formItemLayout?: {} | undefined;
    children: any;
  }) => JSX.Element;
  static Item: any;
  constructor(props) {
    super(props);
    const { formRef, form } = props;
    if (typeof formRef === "function") {
      formRef(form);
    }
  }

  renderFormGroup(props) {
    const { form } = this.props;
    return <FormGroup {...props} form={form} />;
  }

  rewriteFieldDecorator(form) {
    const { getFieldDecorator } = form;
    form.getXFieldDecorator = (key, { rules = [], ...options }) => {
      return getFieldDecorator(key, {
        ...options,
        rules: transformRules(rules)
      });
    };
    return form;
  }

  renderFormGroups(props) {
    const {
      children,
      form,
      disabled,
      form: { getFieldsValue }
    } = props;
    if (typeof children === "function") {
      return children(this.rewriteFieldDecorator(form), getFieldsValue());
    }
    return Children.map(children, (child, index) => {
      if (!child) {
        return null;
      }
      const childProps = Object.assign(
        {
          form,
          disabled
        },
        child.props
      );

      if (child.type !== FormGroup) {
        return child;
      }
      return this.renderFormGroup(childProps);
    });
  }

  render() {
    const { layout } = this.props;
    return (
      <Form layout={layout} className="x-form">
        {this.renderFormGroup(this.props)}
        {this.renderFormGroups(this.props)}
      </Form>
    );
  }
}

XForm.FormGroup = FormGroup;
XForm.Item = Form.Item;
