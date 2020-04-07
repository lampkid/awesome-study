import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import locale from 'antd/lib/date-picker/locale/zh_CN';

import classnames from 'classnames';

import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

const prefixCls = 'x-range-picker';

import './index.less';

const parseValue = (value, _format, format) => {
  if (value) {
    if (_format === 'string' && _.isString(value)) {
      const valueArr = value.split('|');
      if (valueArr.length === 2) {
        return [moment(valueArr[0], format), moment(valueArr[1], format)];
      }
    }
    if (_format === 'array' && _.isArray(value)) {
      const valueArr = value;
      if (valueArr.length === 2 && valueArr[0] && valueArr[1]) {
        return [moment(valueArr[0], format), moment(valueArr[1], format)];
      }
    }
    if (
      _format === 'moment' && _.isArray(value) && value.length === 2
      && (moment.isMoment(value[0]) && moment.isMoment(value[1]))
    ) {
      return value;
    }

    if (_format === 'millitimestamp' &&_.isArray(value) && value.length === 2) {
      return [moment(value[0]), moment(value[1])];
    }
  }
  return undefined;
};

export default class FormatDateRange extends PureComponent {
  /* eslint-disable react/prop-types */
  /* value 不能设置默认Prop */

  static propTypes = {
    format: PropTypes.string,
    _format: PropTypes.string,
    disabledDate: PropTypes.oneOf([PropTypes.func, PropTypes.string]),
    onChange: PropTypes.func,
  }

  static defaultProps = {
    format: 'YYYY-MM-DD',
    _format: 'array',
    disabledDate: undefined,
    onChange: value => console.log(value),
  }

  constructor(props) {
    super(props);

    const { value, _format, format } = props;

    this.state = {
      value: parseValue(value, _format, format),
    };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    const { _format, format } = this.props;
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({
        value: parseValue(value, _format, format),
      });
    }
  }

  triggerChange = (changedValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  }

  handleOnChange = (value, stringValue) => {
    if (!('value' in this.props)) {
      this.setState({
        value,
      });
    }
    const { _format } = this.props;
    let newValue;
    if (_format === 'string') {
      if (stringValue.join('|') !== '|') {
        newValue = stringValue.join('|');
      }
    } else if(_format === 'array') {
      newValue = stringValue;
    } else if (_format === 'millitimestamp' && Array.isArray(value) && value.length === 2) {
      newValue = [+value[0].format('x'), +value[1].format('x')];
    } else {
      newValue = value;
    }
    this.triggerChange(newValue);
  }

  fromNow(value) {
    // future
    if (!value) {
      return false;
    }

    return value.valueOf() < moment().valueOf();
  }

  fromToday(value) {
    if (!value) {
      return false;
    }
    // 时分秒不可选时，今日日期可选必须小于昨日
    return value.valueOf() < moment().subtract(1, 'days').valueOf();
  }

  endToday(value) {
    if (!value) {
      return false;
    }
    return value.valueOf() > moment({ hour: 23, minute: 59, seconds: 59 }).valueOf();
  }

  endNow(value) {
    // past
    if (!value) {
      return false;
    }

    return value.valueOf() > moment().valueOf();
  }

  render() {
    const {
      _format,
      onChange,
      value: propValue,
      className,
      disabledDate,
      ...others
    } = this.props;

    const { value } = this.state;

    const disabledDate = typeof disabledDate === 'string' ? this[disabledDate] : disabledDate;

    // className 不是选择器本身的，而是input区域的, // 考虑自定义container

    return (
      <RangePicker
        className={classnames(prefixCls, className)}
        disabledDate={disabledDate}
        value={value}
        onChange={this.handleOnChange}
        locale={locale}
        {...others}
      />
    );
  }
}
