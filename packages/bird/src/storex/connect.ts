import { connect as connectRedux } from "react-redux";

function bindActionCreatorX(actionCreator, dispatch) {
  return function() {
    const action = actionCreator.apply(this, arguments);
    // todo: async action 判断条件自定义
    if (action.type.match(/start$/)) {
      return new Promise((resolve, reject) => {
        dispatch({ ...action, resolve, reject });
      });
    }
    return dispatch(action);
  };
}

function bindActionCreatorsX(actionCreators, dispatch) {
  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];

    if (typeof actionCreator === "function") {
      boundActionCreators[key] = bindActionCreatorX(actionCreator, dispatch);
    }
  }

  return boundActionCreators;
}

/*
 * feat: dispatch actionCreator
 * https://redux.js.org/api/bindactioncreators
 */
function transformActionCreatorsRecursive(actionCreators, dispatch) {
  const functionMap = {},
    objectMap = {};
  Object.keys(actionCreators).forEach(key => {
    const actionCreator = actionCreators[key];
    if (typeof actionCreator === "function") {
      functionMap[key] = actionCreator;
    } else if (typeof actionCreator === "object") {
      objectMap[key] = actionCreator;
    }
  });

  const actions = bindActionCreatorsX(functionMap, dispatch);

  return Object.keys(objectMap).reduce((prevActions, actionKey) => {
    return {
      ...prevActions,
      [actionKey]: transformActionCreatorsRecursive(
        objectMap[actionKey],
        dispatch
      )
    };
  }, actions);
}
export function connect(
  mapStateToProps,
  actionCreators,
  options = { spread: false }
) {
  const decoratedMapStateToProps = (state, props) => {
    if (typeof mapStateToProps === "function") {
      return mapStateToProps(state, props);
    } else if (typeof mapStateToProps === "object") {
      // todo:
      // connect computed，可传入state和props供computed函数使用
    }
  };
  return connectRedux(
    decoratedMapStateToProps,
    typeof actionCreators === "function"
      ? actionCreators
      : dispatch => {
          const actions = transformActionCreatorsRecursive(
            actionCreators,
            dispatch
          );
          return options.spread ? actions : { actions };
        }
  );
}
