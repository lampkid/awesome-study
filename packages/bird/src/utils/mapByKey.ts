type TKey = string;
import mapKeys from "./mapKeys";
export default function mapByKey(arr: [], key: TKey, sourceDestMap) {
  return (arr || []).reduce((prevMap, next) => {
    return {
      ...prevMap,
      [next[key]]: mapKeys(next, sourceDestMap)
    };
  }, {});
}
