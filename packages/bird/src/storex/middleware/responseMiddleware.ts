import createBrowserHistory from "history/createHashHistory";
const history = createBrowserHistory();
const NO_AUTH_CODE = 403;

function createResponseMiddleware({ authCode, login, prompt = window.alert }) {
  return ({ getState }) => {
    return next => action => {
      const actionType = String(action.type);
      const actionPayload = action.payload;

      if (action.type && /failure$/.test(actionType)) {
        const { errno, errmsg } = action.payload;
        // todo: 考虑并发请求payload是一个数组
        if (errno == authCode) {
          history.push({ pathname: login });
        } else {
          prompt(errmsg);
          next(action);
        }
      } else {
        next(action);
      }
    };
  };
}

export default createResponseMiddleware;
