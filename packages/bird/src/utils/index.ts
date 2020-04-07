import deepMerge from "deepmerge";
import _ from "lodash";
import qs from "qs";

export function hasAPIAuth(auths, authKey) {
  if (authKey === undefined) {
    return true;
  }
  if (!isMisp) {
    return true;
  }
  return !!auths[authKey];
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
    }
  });
  return { ...search, ...formatSearch };
}

export const formatData = formatSearch;
