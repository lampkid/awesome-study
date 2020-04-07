/* eslint-disable */
import React from "react";
import "./index.less";
import _ from "lodash";

import { Radio, Checkbox, Icon } from "antd";
import Select from "./Select";
import RemoteSelect from "./Select/RemoteSelect";
import RadioGroup from "./RadioGroup";
import CheckboxGroup from "./CheckboxGroup";
import ButtonSelect from "./ButtonSelect";
import Input from "./Input";
const TextArea = Input.TextArea;
// MultipleCheckboxGroup, FormatDateRange, FormatDatePicker as DatePicker
import FormatDateRange from "./FormatDateRange";
import FormatDatePicker from "./FormatDatePicker";
const DatetimePicker = FormatDatePicker;

import InputNumber from "./InputNumber";

import Switch from "./Switch";

import Media from "./Media";

Media.set({ action: "/upload", name: "filedata" });

import TextLabel from "./TextLabel";

const IPT_STYLE = {
  "*": {
    minWidth: 80,
    maxWidth: 500
  },
  textarea: {
    maxWidth: "100%"
  }
};

function PlainText(props) {
  const { value, options } = props;
  const displayedValue = _.isPlainObject(options) ? options[value] : value;
  return <span>{displayedValue}</span>;
}

function Title({ defaultValue }) {
  return <TextLabel>{defaultValue}</TextLabel>;
}

const IPT_COMPONENT_MAP = {
  "plain-text": {
    component: PlainText
  },
  title: {
    component: Title
  },
  string: {
    component: Input
  },
  url: {
    component: Input
  },
  text: {
    // component: Input, //rows, type: rich, type: code,type:num
    render(props) {
      return Input;
    }
  },
  hidden: {
    component: Input
    // todo: type = 'hidden'的原生input实现, 必须隐藏formItem
  },
  textarea: {
    component: TextArea,
    props: {
      rows: 5
    }
  },
  number: {
    component: InputNumber
  },
  select: {
    component: Select, // type: 'button-select', 'antd-select',type: radio,checkbox
    render(props) {
      return Select;
    }
  },
  "remote-select": {
    component: RemoteSelect
  },
  "button-select": {
    component: ButtonSelect
  },
  "radio-group": {
    component: RadioGroup
  },
  "checkbox-group": {
    component: CheckboxGroup
  },

  enum: {
    component: Select
  },
  radio: {
    component: Radio // no support
  },
  switch: {
    component: Switch
  },
  checkbox: {
    component: Checkbox
  },
  media: {
    component: Media,
    size: "contain",
    upload: {}
  },
  image: {
    component: Media,
    size: "contain",
    upload: {}
  },
  video: {
    component: Media,
    size: "contain",
    upload: {}
  },
  date: {
    component: FormatDatePicker,
    props: {
      showTime: false
    }
  },
  datetime: {
    render(props) {
      let result = DatetimePicker;
      return result; // type: range, type: time, time-range
    },
    props: {
      showTime: true,
      format: "YYYY-MM-DD HH:mm:ss"
    }
  },
  "date-range": {
    component: FormatDateRange
  },
  "datetime-range": {
    component: FormatDateRange,
    props: {
      showTime: true,
      format: "YYYY-MM-DD HH:mm:ss"
    }
  },
  "time-range": {
    // component: TimeRange
  }
};

function getFieldType(props) {
  return props.type || "text";
}

function getFieldOptions(props) {
  const {
    options,
    preservedOptions = false,
    textKey = "label",
    valueKey = "value"
  } = props;
  if (!preservedOptions && Array.isArray(options)) {
    const optionMap = options.reduce((prevOptions, item) => {
      const value = _.get(item, valueKey);
      const constructedLabel = Array.isArray(textKey)
        ? textKey
            .map((key, index) => {
              const v = `${_.get(item, key, "")}`;
              if (index === 0) {
                return `[${v}]`;
              }
              return v;
            })
            .join("")
        : _.get(item, textKey, "");

      if (!constructedLabel) {
        console.warn("label is empty", textKey);
      }
      const slicedText = constructedLabel.slice(0, 15);
      const label =
        constructedLabel.length > 15 ? `${slicedText}...` : slicedText;
      return {
        ...prevOptions,
        [value]: [label]
      };
    }, {});
    return { options: optionMap };
  }
}

function getFieldProps(props) {
  const type = getFieldType(props);
  const optionsProps = getFieldOptions(props); // 此处统一处理单选多选的optons格式，有点侵入
  const presetProps = IPT_COMPONENT_MAP[type] && IPT_COMPONENT_MAP[type].props;
  const newProps = { ...presetProps, ...props, ...optionsProps };
  return newProps;
}

class Ipt extends React.Component {
  render() {
    const props = this.props;
    const error = props.error || "";
    const type = getFieldType(props);
    const {
      component,
      display = true,
      addOn,
      extra,
      onChange,
      ...mainProps
    } = props;
    if (!IPT_COMPONENT_MAP[type]) {
      console.warn("no support for component type:", type, "props:", props);
      return null;
    }

    if (!display) {
      return null;
    }

    let IptComponent;
    if (component) {
      IptComponent = component;
    } else {
      IptComponent =
        IPT_COMPONENT_MAP[type] && IPT_COMPONENT_MAP[type].component;
      const render = IPT_COMPONENT_MAP[type] && IPT_COMPONENT_MAP[type].render;
      if (render) {
        IptComponent = render(mainProps);
      }
    }

    const fieldProps = getFieldProps(mainProps);
    if (error) {
      let { style = {} } = fieldProps;
      style = { ...style, border: "1px solid red" };
      fieldProps.style = style;
    }

    // 只对format === number的情况统一处理
    fieldProps.onChange = function(...args) {
      const value = args[0];
      typeof onChange === "function" &&
      props.format === "number" &&
      typeof value !== "undefined"
        ? onChange(+value)
        : onChange(...args);
    };
    let iptComp = `no support for ${type}`;
    if (IptComponent) {
      iptComp = React.createElement(
        IptComponent,
        fieldProps,
        mainProps.children
      );
    }
    const extraComp = (
      <span>
        {typeof extra === "string" ? (
          extra
        ) : extra && extra.tip ? (
          <>
            <Icon type={extra.icon || "info"} /> {extra.tip}
          </>
        ) : (
          extra
        )}
      </span>
    );

    const { style } = props;
    const { [type]: iptStyle } = IPT_STYLE;
    const finalIptStyle = { ...IPT_STYLE["*"], ...iptStyle, ...style };

    return (
      <div className={`x-ipt-wrapper x-ipt-wrapper-${type}`}>
        <div className="ipt-layout-wrap">
          <div
            className="ipt-comp"
            style={{
              ...finalIptStyle,
              flex: finalIptStyle.width ? "initial" : 1
            }}
          >
            {iptComp}
          </div>
          <div className="ipt-extra">{extraComp}</div>
        </div>
        {addOn}
      </div>
    );
  }
}

Ipt.register = function({ type, component }) {
  IPT_COMPONENT_MAP[type] = {
    component
  };
};

Ipt.injectStyle = function(style) {
  Object.assign(IPT_STYLE, style);
};

export default Ipt;
