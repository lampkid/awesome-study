import React from 'react';

import { Checkbox as AntdCheckbox } from 'antd';
const Option = AntdCheckbox;
const Group = AntdCheckbox.Group;

export default class CheckboxGroup extends React.Component {
  render() {
    const {
      options,
      disabledValues = [],
      value: rawValue,
      format = 'array',
      onChange,
      ...otherProps
    } = this.props;
    let opt = [];
    if (typeof rawValue === 'undefined') {
      value = undefined;
    } else if (Array.isArray(rawValue)) {
      value = rawValue.map(item => `${item}`);
    } else {
      value = `${rawValue}`
    }
    const value
    for(let optionValue in options) {
      const disabled = disabledValues.includes(optionValue);
      opt.push(
        <Option
          key={optionValue}
          value={optionValue}
          disabled={disabled}>
          {options[optionValue]}
        </Option>
      );
    }
    return (
      <Group
        style={{width: '100%'}}
        onChange={(value) => {
          const formatValue = format === 'string' ? value.join(',') : value;
          onChange && onChange(formatValue);
        }}
        {...otherProps}
        value={value}>
        {opt}
      </Group>
    )
  }
}
