import axios from "axios";
import querystring from "querystring";
const statusMap = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。"
};

const requestConfig = {};

function joinQuery(url: string, query) {
  if (!query) {
    return url;
  }

  const queryString = querystring.stringify(query);
  let sep = "?";
  if (url.indexOf("?") !== -1) {
    sep = "&";
  }
  return [url, queryString].join(sep);
}
function parseConfig({
  url,
  method = "get",
  query,
  paramsKey,
  params,
  contentType = "json",
  ...others
}) {
  /*
   * baseUrl
   * params
   * url: path
   * headers: {
   *  content-type: 'application/x-www-form-urlencoded'
   * }
   */
  const methodKeyMap = {
    get: "params",
    post: "data"
  };
  const dataKey = paramsKey || methodKeyMap[method.toLowerCase()] || "data";

  const contentTypeMap = {
    form: "application/x-www-form-urlencoded",
    json: "application/json",
    file: "multipart/form-data"
  };
  const reqContentType = contentTypeMap[contentType.toLowerCase()];

  return {
    url: joinQuery(url, query),
    method,
    [dataKey]: params,
    headers: {
      "Content-Type": reqContentType
    },
    ...requestConfig,
    ...others
  };
}

function handleResponse(res) {
  const { status, data } = res;

  return data;
}

function handleError(err) {
  return err;
}

// todo: request支持并发请求，后面再支持saga并发请求
function request(config) {
  if (Array.isArray(config)) {
    return axios
      .all(
        config.map(singleConf => {
          return axios({
            ...parseConfig(singleConf)
          }).catch(err => {
            console.log(err);
          });
        })
      )
      .then(
        axios.spread(function(...res) {
          return res.map(singleRes => handleResponse(singleRes));
        })
      )
      .catch(err => handleError(err));
  } else {
    return axios({
      ...parseConfig(config)
    })
      .then(res => handleResponse(res))
      .catch(err => handleError(err));
  }
}

request.setBaseUrl = function(baseUrl) {
  requestConfig.baseURL = baseUrl;
};

request.setConfig = function(config) {
  Object.assign(requestConfig, config);
};

request.getConfig = function() {
  return { ...requestConfig };
};

export default request;
