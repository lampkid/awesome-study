import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Checkbox } from "antd";

import "./index.less";

const prefixCls = `x_multipleCheckboxGroup`;

export default class MultipleCheckboxGroup extends PureComponent {
  /* eslint-disable react/prop-types */
  /* value 不能设置默认Prop */
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func,
    format: PropTypes.string,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    options: undefined,
    onChange: value => console.log(value),
    format: "array",
    disabled: false
  };

  constructor(props) {
    super(props);

    const { value = [] } = props;

    this.state = {
      value
    };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    const { format } = this.props;
    if ("value" in nextProps) {
      const { value } = nextProps;
      this.setState({
        value: format === "string" && value ? value.split(",") : value
      });
    }
  }

  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  };

  handleOnChange = (checked, key) => {
    const { value } = this.state;
    let newValue = value ? [...value] : [];
    if (!checked) {
      newValue = newValue.filter(item => item !== key);
    } else if (newValue.indexOf(key) === -1) {
      newValue.push(key);
    }

    const { max } = this.props;

    if (max && newValue.length > max) {
      return;
    }
    if (!("value" in this.props)) {
      this.setState({
        value: newValue
      });
    }
    const { format } = this.props;
    this.triggerChange(format === "string" ? newValue.join(",") : newValue);
  };

  render() {
    const { className, options: optionsData = [], disabled } = this.props;

    const cls = classNames(className, prefixCls, {
      [`${prefixCls}-disabled`]: disabled
    });

    const { value: checkedValue } = this.state;

    return (
      <div className={cls}>
        {Array.isArray(optionsData) &&
          optionsData.map(({ name: title = "", list: options = [] }, index) => (
            <div key={index} className={`${prefixCls}-item`}>
              <span className={`${prefixCls}-title`}>{title}</span>
              <div className="ant-checkbox-group">
                {options.map(({ name: label = "", id: value = "" }) => (
                  <Checkbox
                    className="ant-checkbox-group-item"
                    disabled={disabled}
                    key={value}
                    checked={
                      !!checkedValue &&
                      !!checkedValue.length &&
                      checkedValue.indexOf(value) > -1
                    }
                    onChange={e => this.handleOnChange(e.target.checked, value)}
                  >
                    {label}
                  </Checkbox>
                ))}
              </div>
            </div>
          ))}
      </div>
    );
  }
}
