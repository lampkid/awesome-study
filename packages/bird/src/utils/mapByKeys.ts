type TKeys = string[];
export default function mapByKeys(arr: [], [key, value]: TKeys) {
  return arr.reduce((prevMap, next) => {
    return {
      ...prevMap,
      [next[key]]: next[value]
    };
  }, {});
}
