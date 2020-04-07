import React, { useState } from "react";

import { TreeSelect as AntdTreeSelect, message, Tooltip, Icon } from "antd";
import { TreeSelectProps } from "antd/es/tree-select";

interface ITreeSelectProps {}

function isMutexValuesSelected(value, mutexValues = []) {
  if (Array.isArray(value)) {
    return mutexValues.some(mutexValue => value.includes(mutexValue));
  }
  return mutexValues.includes(value);
}

function formatArrayOptions(options = [], value, mutexValues = [], parentObj = { parent: undefined, mutex: false }) {
  return options.map(item => {
    const { children = [] } = item;
    if (children.length > 0) {
      children = formatArrayOptions(children, value, mutexValues, item);
    }

    let disableCheckbox = (Array.isArray(value)
    ? !value.includes(item.value)
    : value !== item.value) && isMutexValuesSelected(value, mutexValues);

    if (Array.isArray(children)) {
      if (children.length) {
        disableCheckbox = true;
      }
    }
    
    const { parent, mutex: parentMutex } = parentObj;

    const { title, mutex: myMutex } = item;

    let mutexFlag;
    if (parentMutex) {
      mutexFlag = parent ?? parentObj.value;
    } else if (myMutex) {
      mutexFlag = item.value;
    }

    return {
      ...item,
      title: myMutex ? <Tooltip title={`选了我就不能选其他组了`}>{title}<Icon style={{ marginLeft: 5, color: '#faad14' }} type='exclamation-circle' /></Tooltip> : title,
      disableCheckbox,
      parent: parent??item.value,
      children,
      mutex: mutexFlag
    };
  });
}
export default function TreeSelect(props: ITreeSelectProps & TreeSelectProps) {
  const {
    options = [],
    mutexValues = [],
    style,
    format = "Array",
    groupMutex = false,
    onChange,
    ...otherProps
  } = props;

  const [value, setValue] = useState(undefined);

  const changeHandler = (callbackValue, label, extra) => {

    let realValue = callbackValue;
    console.log('extra:', extra)
    if (groupMutex) {
      const {allCheckedNodes, triggerValue } = extra;
      if (allCheckedNodes.reduce((prevParent, node) => { 
        if(prevParent.includes(node.node.props.parent)) {
          return prevParent;
        }
        return [...prevParent, node.node.props.parent]
      }, []).length > 1) {
        // realValue = value; // 保留
        realValue = triggerValue // 不保留原来分组已选中的值

        message.warn({content: '只能选择相同组的审核结果'});
      }
    }
      const {allCheckedNodes, triggerValue } = extra;
      if (allCheckedNodes.reduce((prevMutexParent:any[], node: { node: { props: { mutex: any; parent: any; }; }; }) => { 
        if(prevMutexParent.includes(node.node.props.mutex)) {
          return prevMutexParent;
        }
        return [...prevMutexParent, node.node.props.mutex]
      }, []).length > 1) {
        // realValue = value; // 保留
        realValue = triggerValue // 不保留原来分组已选中的值

        message.warn({content: '不能选择互斥的分组'});
      }
    
    if (typeof realValue !== undefined) {
      if (isMutexValuesSelected(callbackValue, mutexValues)) {
        realValue = Array.isArray(callbackValue) ? mutexValues : mutexValues[0]; // 默认多选
      }
    }
    setValue(realValue);
    onChange(
      format === "String" && Array.isArray(realValue)
        ? realValue.join(",")
        : realValue
    );
  };

  return (
    <AntdTreeSelect
      style={{ width: "100%", ...style }}
      dropdownMatchSelectWidth={false}
      treeDefaultExpandAll
      treeData={formatArrayOptions(options, value, mutexValues)}
      size="large"
      treeNodeFilterProp="label"
      multiple
      treeCheckable
      onChange={changeHandler}
      {...otherProps}
      value={
        format === "String" && typeof value === "string"
          ? value.split(",")
          : value
      }
    />
  );
}
