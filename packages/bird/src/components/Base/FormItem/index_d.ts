import React from "react";

export enum HelpIcon {
  default = "question",
  warning = "exclamation"
}

export enum FormItemChildrenLayout {
  inline = "inline",
  vertical = "vertical"
}
export type ChildrenElement = React.ReactElement | undefined;
export interface IFormItemProps {
  key?: string | number;
  colon?: boolean;
  label?: string;
  required?: boolean;
  error?: string;
  help?: string;
  helpIcon?: HelpIcon;
  children?: React.ReactElement | ChildrenElement[];
  childrenLayout?: FormItemChildrenLayout;
}
