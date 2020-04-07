import deepMerge from "deepmerge";
export function deepmerge(target, source) {
  return deepMerge(target, source);
}

export function dottedToJSON(obj) {
  return Object.keys(obj).reduce((prevMap, dottedKey) => {
    const value = obj[dottedKey];
    let jsonValue = value;
    if (_.isPlainObject(value)) {
      jsonValue = dottedToJSON(value);
    }
    _.set(prevMap, dottedKey, jsonValue);

    return prevMap;
  }, {});
}

export function getMappedParams(paramsKeyMap, paramsSource) {
  const mapKeys = Object.keys(paramsKeyMap || {});
  const dottedKeyParams = mapKeys.reduce((prevParams, key) => {
    let source = paramsKeyMap[key];
    if (typeof source === "string") {
      source = {
        sourceKey: source
      };
    }
    const { sourceKey, dataType } = source;
    let value = _.get(paramsSource, sourceKey);
    if (value !== undefined) {
      if (dataType === "number") {
        value = +value;
      } else if (dataType === "string") {
        value = `${value}`;
      }
    }
    return {
      ...prevParams,
      [key]: value
    };
  }, {});
  const params = dottedToJSON(dottedKeyParams);
  return params;
}

export function processApiConfig(apiOption, params = {}, paramsSource = {}) {
  const {
    params: paramsConfig = {},
    paramsKeyMap,
    ...otherApiOption
  } = apiOption;

  const mappedParams = getMappedParams(apiOption, paramsSource);
  return {
    params: deepMerge(paramsConfig, deepMerge({ ...params }, mappedParams)),
    ...otherApiOption
  };
}

export function getApi(apiOptions, params, paramsSource = {}) {
  if (Array.isArray(apiOptions)) {
    return apiOptions.map(api =>
      processApiConfig(api, { ...params }, paramsSource)
    );
  }

  // 处理单个请求的情况
  return processApiConfig(apiOptions, params, paramsSource);
}
