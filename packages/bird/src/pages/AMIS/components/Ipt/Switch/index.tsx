import React from 'react';

import { Fragment } from 'react'; 

import { Switch as AntdSwitch } from 'antd';

export default class Switch extends React.Component {
  render() {
    const { tip, value, format="number",  options = { 'true': 1, 'false': 0 }, onChange, ...otherProps } = this.props;
    const vkOptions = Object.keys(options).reduce((prev, key) => {
      return {
        ...prev,
        [options[key]]: key === 'true' ? true : false
      }
    }, {});
    return (
      <Fragment>
        <AntdSwitch 
          { ...otherProps } 
          checked={vkOptions[value]} 
          onChange={
            (checked) => {
              const cbValue = format === 'number' ? options[checked.toString()] : checked;
              onChange && onChange(cbValue);
            }
          }
        />
        <span className="tip" style={{ marginLeft: 5, color: '#666' }}>{tip}</span>
      </Fragment>
    );
  }
}
