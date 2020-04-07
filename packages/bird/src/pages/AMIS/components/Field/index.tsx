import React from "react";


import Field from "./Base";
import TreeSelect from "./TreeSelect";

interface IPlainProps {
  value: string | number;
}
function Plain({ value }: IPlainProps) {
  return <div>{value}</div>;
}

export default function registerFieldComponents() {
  Field.use(Plain, {
    type: "plain"
  });

  Field.use(TreeSelect, {
    type: "tree-select"
  });
}
