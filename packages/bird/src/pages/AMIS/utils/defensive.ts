import lodash from "lodash";

interface IDynamicMap {
  [key: string]: {} | [];
}

export default function defensive(
  value: null | undefined | [] | {},
  type: string = "Object",
  key?: string
) {
  const typeValueMap: IDynamicMap = {
    Object: {},
    Array: []
  };
  const defaultValue = typeValueMap[type];
  let retValue = value;
  if (key) {
    retValue = lodash.get(value || {}, key);
  }
  return retValue || defaultValue;
}
