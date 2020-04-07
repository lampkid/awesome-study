/* feat: action creator and reducer creator
 * https://redux-actions.js.org/#documentation
 */
import {
  createActions as createActionsOriginal,
  handleActions as handleActionsOriginal,
  combineActions
} from "redux-actions";

// todo: hooks: onStart/onFinish/onSuccess/onFailure

// function createActions(actionMap, ...identityActions,  options) {
// todo: nested async action
function createActions(actionMap, options) {
  if (typeof options === "string") {
    options = {
      prefix: options
    };
  }
  let newActionMap = Object.keys(actionMap).reduce((prevMap, actionType) => {
    const stateActionMapUserDefined = actionMap[actionType];
    let stateActionMap;
    if (actionType.startsWith("$")) {
      const isObj =
        Object.prototype.toString.call(stateActionMapUserDefined) ===
        "[object Object]";

      stateActionMap = [
        "before",
        "start",
        "finish",
        "success",
        "failure",
        "always"
      ].reduce((prevStateMap, stateType) => {
        // 如果已经定义了start等的payload creator，则使用自定义的，如果直接定义$acionType为payload creator，则只用于start
        const payloadCreator =
          (isObj && stateActionMapUserDefined[stateType]) ||
          ((stateType === "start" && actionMap[actionType]) || undefined);
        return {
          ...prevStateMap,
          [`${stateType}`]: payloadCreator // payloadCreator 可以是一个thunk，被payloadThunk middleware处理
        };
      }, {});
    }
    return {
      ...prevMap,
      [actionType]: stateActionMap || stateActionMapUserDefined
    };
  }, {});
  // return createActionsOriginal(newActionMap, ...identityActions, options);
  return createActionsOriginal(newActionMap, options);
}

function handleActions(reducerMap, defaultState, options) {
  if (typeof options === "string") {
    options = {
      prefix: options
    };
  }
  const newReducerMap = Object.keys(reducerMap).reduce(
    (prevReducerMap, actionType) => {
      const reducer = reducerMap[actionType];
      // TODO: Map
      if (typeof reducer === "object") {
        return {
          ...prevReducerMap,
          ...new Map(
            Object.keys(reducer).map(stateType => [
              `${actionType}/${stateType}`,
              reducer[stateType]
            ])
          ) // 异步action各个状态对应的reducer, start, finish, failure
        };
      } else if (typeof reducer === "function") {
        return {
          ...prevReducerMap,
          [actionType]: reducer
        };
      }
    },
    {}
  );

  return handleActionsOriginal(newReducerMap, defaultState, options);
}

export { createActions, handleActions, combineActions };
