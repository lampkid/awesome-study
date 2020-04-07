import React from "react";

import { RouteComponentProps } from "react-router";

import { contextConsume } from "../state";

import classNames from "classnames";

type TParams = {
}


export default function ReducerHookDemo(props: RouteComponentProps<TParams>) {
  // todo connect mapStateToProps, mapDispatchToProps

  const {
    state: {
      ns1: {
        value: value1,
      },
      ns2: {
        value: value2,
      },
      ns3: { 
        value: value3
      }
    },
    dispatch
  } = contextConsume();

  // todo: 当某一个节点需要根据某个变量判断要不要展示，编码的最佳实践是什么？varribleValue && <JSX /> ?

  return (
    <div>
      {value1}
      {value2}
      {value3}
    </div>
  );
}
