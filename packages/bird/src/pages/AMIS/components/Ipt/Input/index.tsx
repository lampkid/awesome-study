import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Icon, Input as AntdInput } from 'antd';

const AntdTextArea = AntdInput.TextArea;

import './index.less';

const prefixCls = `x-input`;

class CommenComponent extends PureComponent {
  /* eslint-disable react/prop-types */
  /* value 不能设置默认Prop */
  static propTypes = {
    maxLength: PropTypes.number,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    maxLength: undefined,
    onChange: () => {
    },
  }

  constructor(props) {
    super(props);

    this.state = {
      value: props.value || '',
      maxLength: props.maxLength,
    };
  }

  componentWillMount() {
    const { value } = this.state;
    if (value) {
      const { onChange } = this.props;
      /* eslint-disable no-unused-expressions */
      onChange && onChange(value);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.noNewLine) {
      this.state.value = nextProps.value !== undefined ? nextProps.value.replace(/\n/g, '') : '';
    } else {
      this.state.value = nextProps.value !== undefined ? nextProps.value : '';
    }
  }

  onChange(e) {
    let value = '';
    if (this.props.noNewLine) {
      value = e.target.value.replace(/\n/g, '');
    } else {
      ({ value } = e.target);
    }
    this.setState({ value }, () => {
      const { onChange } = this.props;
      onChange && onChange(value === "" ? undefined : value);
    });
  }

  getLimit(type) {
    const { maxLength, value } = this.state;
    const { displayLimit } = this.props;
    const cls = classNames(type, 'limit');
    if (maxLength && displayLimit !== false) {
      const lenStyle = { color: '#44c8a6' };
      if (value.length > maxLength) {
        lenStyle.color = '#e67e7e';
      }
      /* eslint-disable jsx-filename-extension */
      return (
        <div className={cls}>
          <span style={lenStyle}>
            {value.length}
          </span>
          /
          <span>
            {maxLength}
          </span>
        </div>
      );
    }
    return '';
  }

  render() {
    return <div />;
  }
}

class TextArea extends CommenComponent {
  render() {
    const {
      _wrapperClassName,
      className,
      ...others
    } = this.props;
    const { value } = this.state;
    const wrapperCls = classNames(_wrapperClassName, `${prefixCls}-wrapper`);
    const cls = classNames(className, `${prefixCls}`);
    return (
      <div
        ref={(e) => {
          this.wrapper = e;
        }}
        className={wrapperCls}
      >
        <AntdTextArea
          className={cls}
          {...others}
          value={value}
          onChange={e => this.onChange(e)}
        />
        {this.getLimit('textarea')}
      </div>
    );
  }
}

export default class Input extends CommenComponent {
  static TextArea = TextArea;

  static getIcon(icon) {
    if (icon) {
      return (
        <div className="icon-wrapper">
          <Icon type={icon} className="icon" />
        </div>
      );
    }
    return '';
  }

  render() {
    const {
      icon,
      _wrapperClassName,
      displayLimit,
      className,
      ...others
    } = this.props;
    const { value } = this.state;
    const wrapperCls = classNames(_wrapperClassName, `${prefixCls}-wrapper`);

    const { maxLength } = this.props;
    const cls = classNames(className, prefixCls, maxLength && displayLimit !== false && `${prefixCls}-max-length`);

    return (
      <div
        ref={(e) => {
          this.wrapper = e;
        }}
        className={wrapperCls}
      >
        <AntdInput
          className={cls}
          autoComplete="off"
          placeholder={`请输入`}
          {...others}
          value={value}
          onChange={e => this.onChange(e)}
        />
        {this.getLimit('input')}
        {Input.getIcon(icon)}
      </div>
    );
  }
}
