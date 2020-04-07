import React from "react";

import { Select as AntdSelect } from "antd";
const Option = AntdSelect.Option;
const Group = AntdSelect;

export default class Select extends React.Component {
  render() {
    const {
      options,
      disabledValues = [],
      value: rawValue,
      optionAll: rawOptionAll,
      addonAfter,
      style,
      onChange,
      ...otherProps
    } = this.props;

    let opt = [];
    let optionAll;
    if (rawOptionAll === true) {
      optionAll = { "": "全部" };
    } else if (typeof rawOptionAll === "object") {
      optionAll = rawOptionAll;
    }

    if (optionAll) {
      Object.keys(optionAll).forEach(key => {
        opt.push(
          <Option key={key} value={key}>
            {optionAll[key]}
          </Option>
        );
      });
    }

    let value;
    if (typeof rawValue === "undefined") {
      value = typeof optionAll === "object" && optionAll[""] ? "" : undefined;
    } else if (Array.isArray(rawValue)) {
      value = rawValue.map(item => `${item}`);
    } else {
      value = `${rawValue}`;
    }
    for (let optionValue in options) {
      const disabled = disabledValues.includes(optionValue);
      opt.push(
        <Option key={optionValue} value={optionValue} disabled={disabled}>
          {options[optionValue]}
        </Option>
      );
    }
    return (
      <div>
        <Group
          placeholder={`请选择`}
          dropdownMatchSelectWidth={false}
          showSearch={true}
          allowClear={true}
          optionFilterProp={"children"}
          style={{ width: "100%", ...style }}
          onChange={value => {
            const formattedValue = value === "" ? undefined : value;
            onChange && onChange(formattedValue);
          }}
          {...otherProps}
          value={value}
        >
          {opt}
        </Group>
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
}
