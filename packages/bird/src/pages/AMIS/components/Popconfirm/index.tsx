import React from 'react';
import { Popconfirm as AntdPopconfirm } from 'antd';

export default function Popconfirm(props) {
  const defaultProps = { title: '确定要执行吗', okText: "是", cancelText: "否" };
  return (
    <AntdPopconfirm { ...defaultProps } {...props} />
  );
}
