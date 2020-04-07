/*
 * filter & wrapper
 * to compose the filter and wrapper
 */
import React from "react";
import { Tooltip, Icon } from "antd";
import moment from "moment";
import _ from "lodash";

const pathToRegexp = require("./path-to-regexp");

export default {
  timestamp(text, record, index, column) {
    const { format = "YYYY-MM-DD HH:mm:ss" } = column;
    return text && moment(text * 1000).format(format);
  },
  millitimestamp(text, record, index, column) {
    const { format = "YYYY-MM-DD HH:mm:ss" } = column;
    return text && moment(text).format(format);
  },
  provider(text, record, index, column, provider) {
    const {
      provider: providerKey,
      textKey = "label",
      valueKey = "value",
      tipKey
    } = column;
    const { [providerKey]: options = {} } = provider;
    let ret = text;
    if (Array.isArray(options)) {
      options.forEach(({ [textKey]: label, [valueKey]: value }) => {
        if (text === value) {
          ret = label;
          return;
        }
      });
    } else {
      ret = options[`${text}`];
    }
    ret = ret || text;
    return ret;
  },
  commaProvider(text, record, index, column, provider) {
    const { provider: providerKey } = column;
    const { [providerKey]: optionMap = {} } = provider;
    return (
      typeof text === "string" &&
      text.split(",").map(itemValue => optionMap[itemValue] || itemValue)
    );
  },
  combiner(text, record, index, column) {
    const { keys } = column;
    const content =
      keys.length >= 2 &&
      `[${_.get(record, keys[0], "")}]${_.get(record, keys[1], "")}`;
    return content;
  },
  joiner(text = [], record, index, column) {
    const { keys, joint = "," } = column;
    if (keys) {
      return keys.map(key => record[key]).join(" ~ "); // todo: 定义一个range
    }
    return text.join(joint);
  },
  objectArray(text, record, index, { itemTextKey = "label", itemKeys }) {
    if (Array.isArray(itemKeys) && Array.isArray(text)) {
      return text.map(item => itemKeys.map(itemKey => item[itemKey]).join("-"));
    }
    return (
      (Array.isArray(text) && text.map(item => item[itemTextKey]).join("、")) ||
      ""
    );
  },
  workBreak(text, record) {
    return (
      <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
        {text}
      </div>
    );
  },
  tooltip(text, record, index, column) {
    const { tipKey, icon = "question-circle" } = column;
    const tip = tipKey && _.get(record, tipKey, "");
    return (
      <div>
        {text}
        {tip && (
          <Tooltip title={tip}>
            <Icon type={icon} />
          </Tooltip>
        )}
      </div>
    );
  },
  thousandsSeparator(text) {
    console.log(text);
    if (typeof text === "number") {
      return `${text}`.replace(
        /(?=(?!^)(?:\d{3})+(?:\.|$))(\d{3}(\.\d+$)?)/g,
        ",$1"
      );
    } else if (typeof text === "string") {
      return text;
    } else {
      return "暂无数据";
    }
  },
  link(text, record, index, column) {
    const { link, target = "_self" } = column;
    const finalLink = pathToRegexp.compile(link)(record);

    return (
      <a href={`${finalLink}`} target={target}>
        {text}
      </a>
    );
  }
};
