import deepMerge from "deepmerge";
import _ from "lodash";
import qs from "qs";


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

export function hasAPIAuth(auths, authKey) {
  if (authKey === undefined) {
    return true;
  }
  if (!isMisp) {
    return true;
  }
  return !!auths[authKey];
}

export function getMappedParams(apiOption, paramsSource) {
  const { paramsKeyMap } = apiOption;

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

export function deepmerge(target, source) {
  return deepMerge(target, source);
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

export function getApi(pageConfig, action, params, paramsSource = {}) {
  const {
    api: { [action]: apiOptions = [], commonParams = {} } = {}
  } = pageConfig;

  if (Array.isArray(apiOptions)) {
    return apiOptions.map(api =>
      processApiConfig(
        { ...api, query: commonParams },
        { ...params },
        paramsSource
      )
    );
  }

  // 处理单个请求的情况
  return processApiConfig(
    { ...apiOptions, query: commonParams },
    { ...params },
    paramsSource
  );
}

export function formatSearch(search, searchFields) {
  let formatSearch = {};
  searchFields.forEach(({ key, destruct, format }) => {
    if (Array.isArray(destruct)) {
      const destructValues = destruct.reduce((values, dKey, index) => {
        return {
          ...values,
          [dKey]: search[key] && search[key][index]
        };
      }, {});

      Object.assign(formatSearch, destructValues);
    }

    if (format === "number" && /-?\d+/.test(search[key])) {
      formatSearch[key] = +search[key];
    } else if (format === "string" && typeof search[key] !== "undefined") {
      formatSearch[key] = `${search[key]}`;
    } else if (format === "number[]" && typeof search[key] !== "undefined") {
      formatSearch[key] = search[key].map(searchItem => +searchItem);
    }
  });
  return { ...search, ...formatSearch };
}

export const formatData = formatSearch;
