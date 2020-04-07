import React from "react";

import { RouteComponentProps } from "react-router";

import { Provider } from "./state";

import Container from "./Container";
export default function HookReducerDemo(props: RouteComponentProps) {
  return (
    <Provider>
      <Container {...props} />
    </Provider>
  );
}
