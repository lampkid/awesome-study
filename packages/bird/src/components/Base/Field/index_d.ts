import { Ioptions } from "@/components/Base/Select/Select_d";

export interface IFieldComponentMap {}

export interface IFieldProps {
  type: string;
  key: string;
  // todo:临时这么写防止报错
  options?: { [index: number]: string };
  onChange?: any;
  value?: any;
  defaultValue?: any;
  mode?: any;
}
