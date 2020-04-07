import lodash from "lodash";
export default function defensive(
  value: null | undefined | [] | {},
  type?: string = "Object",
  key?: string
) {
  const typeValueMap = {
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
