import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Popconfirm, Radio, Icon } from 'antd';
import { hasAuth, convertPath } from './utils';

/*
 * table 行操作区
 * @param record
 * @param auths
 */

/*
 * key: operation key,
 * title: label,
 * type: a, link, action
 * confirm: true/false
 * newTab: true/false
 * to: type 为link时的跳转链接
 * onClick: 非Link时可定义onClick
 */


const typeEleMap = {
  a: 'a',
  link: Link,
  action: 'a',
  pop: 'a'
};

const toKeyMap = {
  a: 'href',
  link: 'to'
};

const tableOperations = {
};

export function registerTableOperation(newOperations) {
  Object.assign(tableOperations, newOperations);
}

const tableOperationConfig = {
  authsForbidden: true
};

export function setTableOperationConfig(operationConfig) {
  /*
   * authsForbidden: boolean
   * operationRender: function
   */
  Object.assign(tableOperationConfig, operationConfig);
}

// todo: 通用的操作处理，不仅仅是TableOperation
export default function TableOperation({
  operations = [],
  actions = {},
  record,
  provider: options = {},
  operationRender, // 同op里的auth是function的情况，但可以统一处理每一个操纵的展示
  index }) {
  const ops = operations.map((op, index) => {

    let newOp = typeof op === 'string' ? { key: op } : op;
    // 操作可为字符串，此时应该提前使用registerTableOperation提前定义好操作
    const { key } = newOp;
    const registeredOperation = actions[key] || tableOperations[key];
    if(typeof registeredOperation === 'function') {
      // 注册操作的动作
      op.onClick = registeredOperation;
    } else if(typeof registeredOperation === 'object') {
      // map
      // 注册整个操作的所有配置
      Object.assign(newOp, registeredOperation);
    }

    
    // todo : 自定义操作
    const {
      title,
      icon,
      type = 'link',
      confirm,
      newTab = false,
      to = '/',
      auth,
      provider: providerKey = key,
      paramKey = key,
      valueKey = key,
      onClick } = newOp;

      const finalOperationRender = operationRender || tableOperationConfig.operationRender;
      if ((typeof finalOperationRender === 'function' && !finalOperationRender(record, newOp)) 
        || hasAuth(record, auth, key) === false) {
        return;
      }

      const style = { marginRight: 10, display: 'inline-block', wordBreak: 'keep-all' };

      const isConfirm = confirm === true ||
        typeof confirm === 'string' ||
        (typeof confirm === 'undefined' &&  type === 'action');
      const isPop = type === 'pop';
      const opProps = { 
        key,
        target: newTab ? '_blank': '_self',
        style,
      };

      if (toKeyMap[type]) {
        Object.assign(opProps, {
          [ toKeyMap[type] ]: convertPath(to, record),
        });
      }

      const handleClick = (e) => {
        if (onClick) {
          e.preventDefault();
          onClick(record);
        }
      };

      if (!isConfirm && !isPop) {
        Object.assign(opProps, {
          onClick: handleClick
        });
      }

      const iconProps = {
      }
    
      typeof icon === 'string' ? Object.assign(iconProps, { type: icon }) : Object.assign(iconProps, { ...icon });
      

      const opComp = React.createElement(typeEleMap[type] || 'a', opProps, icon ? <Icon { ...iconProps } /> : title);
      if (isConfirm) {
        const confirmProps = {
          key,
          okText: "是",
          cancelText: "否",
          title: `确定要执行${title}吗`,
          onConfirm: handleClick
        };
        if (typeof confirm === 'string') {
          Object.assign(confirmProps, {
            title: confirm
          });
        }
        return (
          <Popconfirm { ...confirmProps }>
            {opComp}
          </Popconfirm>
        );
      }

      return opComp;
  });
  return (
    <Fragment>
      {ops}
    </Fragment>
  );
}
