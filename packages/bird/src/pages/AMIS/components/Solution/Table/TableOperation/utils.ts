// const pathToRegexp = require('path-to-regexp');
import { generatePath } from 'react-router';
import _ from 'lodash';
export function convertPath(path, record) {
  //const newPath = pathToRegexp.compile(path)(record);
  const newPath = generatePath(path, record);
  return newPath;
}

export function hasAuth(record, auth, key) {
  if (typeof auth === 'boolean') {
    return auth;
  }
  if (typeof auth === 'function') {
    return auth(record, key);
  }

  /*
   * auth: {
   *  status: [1, 2, 3]
   * }
   */
  if (typeof auth === 'object') {
    return Object.keys(auth).every(authColKey => {
      const authColValue = auth[authColKey];
      if (Array.isArray(authColValue) && authColValue.includes(_.get(record, authColKey))) {
        return true;
      }
    });
  }

}
