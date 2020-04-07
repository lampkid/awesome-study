import React from "react";

import { IFieldComponentMap, IFieldProps } from "./index_d";
const FieldComponentMap: { [key: string]: any } = {};
export default function Field(props: IFieldProps) {
  const { type, ...otherProps } = props;
  const fieldOptions = FieldComponentMap[type];
  if (!fieldOptions) {
    return null;
  }
  const { component, props: defaultProps } = fieldOptions;
  return (
    <div>
      {React.createElement(component, { ...defaultProps, ...otherProps })}
    </div>
  );
}

Field.register = function(
  component: React.ComponentType<any>,
  options: { type: string; props?: {} }
) {
  const { type, ...otherOptions } = options;
  FieldComponentMap[type] = {
    component,
    ...otherOptions
  };
};

Field.use = Field.register;
