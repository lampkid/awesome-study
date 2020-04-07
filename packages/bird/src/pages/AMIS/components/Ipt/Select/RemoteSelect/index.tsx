import React from "react";
import { Select, Spin } from "antd";
import _ from "lodash";
import deepmerge from "deepmerge";

import request from "@/utils/request";

const { Option } = Select;

export default class RemoteSelect extends React.Component {
  static defaultProps = {
    // todo: optionRender
    optionRender() {}
  };

  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchOptions = _.debounce(this.fetchOptions, 800);
  }

  state = {
    data: [],
    value: this.props.value,
    fetching: false
  };

  fetchOptions = (value, callback) => {
    if (!value || (value && !value.trim())) {
      return;
    }
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    // sidKey, stextKey : request key
    const {
      api: { params, queryWrapKey = "filter", ...otherApiOptions },
      sidType = "number",
      sidKey = "id",
      stextKey = "text"
    } = this.props;

    const searchParams = /\d+/.test(value)
      ? { [sidKey]: sidType === "number" ? +value : `${value}` }
      : { [stextKey]: value };

    this.setState({ data: [], fetching: true });
    request({
      ...otherApiOptions,
      params: deepmerge({ [queryWrapKey]: searchParams }, params)
    }).then(response => {
      if (fetchId !== this.lastFetchId) {
        // for fetch callback order
        return;
      }
      const { textKey = "label", valueKey = "value" } = this.props;
      const data = response.data.list.map(item => ({
        text: Array.isArray(textKey)
          ? textKey.map(key => _.get(item, key)).join("-")
          : _.get(item, textKey),
        value: `${_.get(item, valueKey)}`
      }));
      this.setState({ data, fetching: false }, () => callback && callback());
    });
  };

  handleChange = value => {
    const { onChange } = this.props;
    this.setState(
      {
        value,
        data: [],
        fetching: false
      },
      () => {
        onChange && onChange(value && value.key);
      }
    );
  };

  componentDidMount() {
    const { value } = this.props;
    // todo: 区分search value和真正的value
    if (typeof value !== "undefined") {
      this.fetchOptions(value, () => {
        const { data } = this.state;
        if (data && data.length === 1) {
          const item = data[0] || {};
          const realValue = _.get(item, "value");
          this.setState(
            { value: { key: realValue, label: _.get(item, "text") } },
            () => {
              const { onChange } = this.props;
              onChange && onChange(realValue, "autochange");
            }
          );
        }
      });
    }
  }

  render() {
    const { fetching, data, value } = this.state;
    const { placeholder } = this.props;
    return (
      <Select
        showSearch
        value={value}
        labelInValue
        dropdownMatchSelectWidth={false}
        placeholder={placeholder}
        notFoundContent={
          fetching ? (
            <Spin size="small" />
          ) : (
            data.length === 0 && "没找到相关内容"
          )
        }
        filterOption={false}
        onSearch={this.fetchOptions}
        onChange={this.handleChange}
        style={{ width: "100%" }}
      >
        {data.map(d => (
          <Option key={d.value} value={d.value}>
            {d.text}
          </Option>
        ))}
      </Select>
    );
  }
}
