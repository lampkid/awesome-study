import mapByKey from "./mapByKey";
export default function mapKeys(obj: {}, keyMap: object = {}) {
  // todo: mapKeys boy keyMap, not obj
  return Object.keys(obj).reduce((prevMap, sourceKey) => {
    const destKey = keyMap[sourceKey] || sourceKey;
    if (typeof destKey === "object") {
      const { key, keyBy } = destKey;
      return {
        ...prevMap,
        [key]: mapByKey(obj[sourceKey], keyBy)
      };
    } else {
      return {
        ...prevMap,
        [destKey]: obj[sourceKey]
      };
    }
  }, {});
}
