import React from "react";
import classnames from "classnames";

import { Icon, Tooltip, Radio as AntdRadio } from "antd";
const Option = AntdRadio;
const ButtonOption = AntdRadio.Button;
const Group = AntdRadio.Group;

const OptionMap = {
  radio: Option,
  button: ButtonOption
};

export default class RadioGroup extends React.Component {
  getOptionComponent(
    optionType,
    label,
    optionValue,
    disabled,
    direction,
    optionTip
  ) {
    const formattedOptionValue = `${optionValue}`;
    const optionStyle =
      direction === "col"
        ? {
            display: "block",
            marginBottom: 10
          }
        : { display: "inline-block" };

    const tip = optionTip[formattedOptionValue];
    const optionComp = [
      React.createElement(
        OptionMap[optionType] || Option,
        {
          key: formattedOptionValue,
          value: formattedOptionValue,
          disabled
        },
        label
      ),
      tip && (
        <Tooltip
          title={Array.isArray(tip) ? tip.map(t => <p>{t}</p>) : tip}
          placement="right"
        >
          <Icon type="question-circle" style={{ verticalAlign: "middle" }} />
        </Tooltip>
      )
    ];

    return optionType === "radio" ? (
      <div style={optionStyle}>{optionComp}</div>
    ) : (
      optionComp
    );
  }
  render() {
    const {
      className,
      options,
      disabledValues = [],
      value,
      style,
      optionTip = {},
      onChange,
      optionType = "radio",
      direction = "row",
      ...otherProps
    } = this.props;

    let opt = [];
    const valueStr = typeof value === "undefined" ? value : `${value}`;

    if (Array.isArray(options)) {
      options.forEach(({ label, value: optionValue }) => {
        const disabled = disabledValues.includes(optionValue);
        opt.push(
          this.getOptionComponent(
            optionType,
            label,
            optionValue,
            disabled,
            direction,
            optionTip
          )
        );
      });
    } else {
      for (let optionValue in options) {
        const disabled = disabledValues.includes(optionValue);
        const label = options[optionValue];

        opt.push(
          this.getOptionComponent(
            optionType,
            label,
            optionValue,
            disabled,
            direction,
            optionTip
          )
        );
      }
    }

    const groupProps = {};
    optionType === "button" &&
      Object.assign(groupProps, {
        buttonStyle: "solid"
      });
    if (typeof valueStr !== undefined) {
      Object.assign(groupProps, { value: valueStr });
    }
    return (
      <Group
        className={classnames(className)}
        style={{ width: "100%", ...style }}
        onChange={e => {
          onChange && onChange(e.target.value);
        }}
        {...groupProps}
        {...otherProps}
      >
        {opt}
      </Group>
    );
  }
}
