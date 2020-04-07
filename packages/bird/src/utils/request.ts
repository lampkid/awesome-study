import axios from "axios";

export interface CommonRequestConfig {
  baseURL?: string;
  method?: string;
  params?: object;
  paramsKey?: string;
  contentType?: string;
}

export interface RequestConfig extends CommonRequestConfig {
  url: string;
}

/*
// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
 });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});
 */

export const STATUS_MAP = {
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

const requestConfig: CommonRequestConfig = {};

function parseConfig({
  url,
  method = "get",
  paramsKey,
  params,
  contentType = "json",
  ...others
}: RequestConfig) {
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

  const contentTypeMap: { form: string; json: string; file: string } = {
    form: "application/x-www-form-urlencoded",
    json: "application/json",
    file: "multipart/form-data"
  };
  const reqContentType = contentTypeMap[contentType.toLowerCase()];

  return {
    url,
    method,
    [dataKey]: params,
    headers: {
      "Content-Type": reqContentType
    },
    ...requestConfig,
    ...others
  };
}

function handleResponse(res: any) {
  const { status, data } = res;

  return data;
}

function handleError(err: any) {
  return err;
}

// todo: request支持并发请求，后面再支持saga并发请求
function request(config: RequestConfig | RequestConfig[]) {
  if (Array.isArray(config)) {
    return axios
      .all(
        config.map(singleConf => {
          return axios({
            ...parseConfig(singleConf)
          }).catch((err: any) => {
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

request.setBaseUrl = function(baseUrl: string) {
  requestConfig.baseURL = baseUrl;
};

request.setConfig = function(config: RequestConfig) {
  Object.assign(requestConfig, config);
};

request.getConfig = function() {
  return { ...requestConfig };
};

// todo: add decorator or injector for request
request.decorate = function(config: RequestConfig | RequestConfig[]) {
  return request(config).then((resp: any) => {
    if (Array.isArray(resp)) {
      const hasError = resp.some(respItem => +respItem.errno !== 0);
      if (hasError) {
        return Promise.reject(resp);
      }
    } else {
      const { errno } = resp;
      if (+errno !== 0) {
        return Promise.reject(resp);
      }
    }
    return resp;
  });
};

request.direct = function(config: RequestConfig | RequestConfig[]) {
  return request(config).then((resp: any) => {
    if (Array.isArray(resp)) {
      const hasError = resp.some(respItem => +respItem.errno !== 0);
      if (hasError) {
        return Promise.reject(resp.map(respItem => respItem.errmsg));
      }
      return resp.map(respItem => respItem.data || {});
    } else {
      const { errno } = resp;
      if (+errno !== 0) {
        return Promise.reject(resp.errmsg);
      }
      const { data = {} } = resp;
      return data;
    }
  });
};

const axiosResponse = axios.interceptors.response;
const axiosRequest = axios.interceptors.request;
request.addRequestMiddleware = axiosRequest.use.bind(axiosRequest);
request.addResponseMiddleware = axiosResponse.use.bind(axiosResponse);

export default request;
