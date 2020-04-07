import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

import { DatePicker } from 'antd';

const parseValue = (value, _format, format) => {
  let retValue;
  if (value) {
    if (_format === 'string' && _.isString(value)) {
      retValue = moment(value, format);
    } else if (_format === 'moment' && moment.isMoment(value)) {
      retValue = value;
    }
  }
  return retValue;
};

export default class FormatDatePicker extends PureComponent {
  /* eslint-disable react/prop-types */
  /* value 不能设置默认Prop */

  static propTypes = {
    format: PropTypes.string,
    _format: PropTypes.string,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    format: 'YYYY-MM-DD',
    _format: 'string',
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
    const { _format, format } = this.props;
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.state.value = parseValue(value, _format, format);
    }
  }

  triggerChange = (changedValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  }

  handleOnChange = (value, stringValue) => {
    const { _format } = this.props;
    this.setState({
      value,
    }, () => {
      this.triggerChange(_format === 'string' ? (stringValue ? stringValue : undefined) : value);  // eslint-disable-line
    });
  }

  render() {
    const {
      _format,
      onChange,
      ...others
    } = this.props;

    const { value } = this.state;

    return (
      <DatePicker
        onChange={this.handleOnChange}
        {...others}
        value={value}
      />
    );
  }
}
