import React from 'react';
import { Modal as AntdModal } from 'antd';

import Button from '../Button';
const { ButtonGroup } = Button;

// todo: Portal?
// destroyOnClose?

export default class Modal  extends React.Component {
  render() {
    const { children, btns, footerCentered=true, ...modalProps } = this.props;
    const customizedModalProps = {
    };
    if (btns) {
      const style = footerCentered ? { textAlign: 'center' }: null;
      Object.assign(customizedModalProps, {
        footer: <ButtonGroup btns={btns} style={style}/>
      });
    }
    return (
      <AntdModal 
        centered
        okText="保存"
        cancelText="取消"
        keyboard={false}
        maskClosable={false}
        { ...customizedModalProps }
        { ...modalProps }
      >
        {children}
      </AntdModal>
    );
  }
}
