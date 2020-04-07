/* eslint-disable */
import React from 'react';

import PropTypes from 'prop-types';

import './index.less';

class ButtonSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      values: this.initValue(props),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.state.values = this.initValue(nextProps);
    }
  }

  updateState() {
    this.setState(this.state, () => {
      const values = Object.keys(this.state.values).filter(value => this.state.values[value]);

      const { multiple } = this.props;

      const changedValue = multiple ? values : values[0];

      this.props.onChange && this.props.onChange(changedValue);
    });
  }

  initValue(props) {
    const value = props.value;
    const values = {};
    if (typeof value !== 'object' && value !== undefined) {
      values[value] = true;
    } else if (Array.isArray(value)) {
      value.map((valueItem, index) => {
        if (valueItem !== undefined) {
          values[valueItem] = true;
        }
      });
    }

    return values;
  }

  renderButton(buttonConfig, index) {
    let selected = '';
    if (this.state.values[buttonConfig.value]) {
      selected = 'selected';
    }

    return (
      <div key={index} className={`button-select-button ${selected}`} onClick={() => this.handleChange(buttonConfig, index)}>
        {buttonConfig.label}
      </div>
    );
  }

  handleChange(buttonConfig) {
    if (buttonConfig.disabled) {
      return;
    }

    let { multiple } = this.props;

    multiple = multiple !== undefined ? multiple : false;
    const value = buttonConfig.value;

    if (!multiple) {
      if (!this.state.values[value]) {
        this.state.values = {};
      }
    }

    this.state.values[value] = !this.state.values[value];


    this.updateState();
  }

  render() {
    let { options } = this.props;
    if (Object.prototype.toString.call(options) === '[object Object]') {
      options = Object.keys(options).map( (key) => {
        return { value: key, label: options[key] }
      });
    }
    return (
      <div>
        {
          (options || []).map((option, index) => this.renderButton(option, index))
        }
      </div>
    );
  }
}

ButtonSelect.defaultProps = {
  value: undefined,
};

ButtonSelect.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
};

export default ButtonSelect;
