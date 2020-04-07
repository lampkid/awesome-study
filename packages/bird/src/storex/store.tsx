/* redux
 * react-redux
 * redux-thunk
 * redux-promise
 * redux-saga
 */

import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk"; // feat: async actions

import reducer from "./reducers";
import { default as sagaMiddleware, startSaga } from "./middleware/saga";
import payloadThunk from "./middleware/payloadThunk";

const reducerMap = {
  noop(state = {}, action) {
    return state;
  }
};

const middlewares = [
  applyMiddleware(payloadThunk),
  applyMiddleware(thunk),
  applyMiddleware(sagaMiddleware)
];

window.__REDUX_DEVTOOLS_EXTENSION__ &&
  middlewares.push(window.__REDUX_DEVTOOLS_EXTENSION__());

const store = createStore(combineReducers(reducerMap), compose(...middlewares));

// ensure once?
export { startSaga };

export function getStore() {
  return store;
}

/* feat: code split for reducers
 * https://medium.com/@matthewgerstman/redux-with-code-splitting-and-type-checking-205195aded46
 */
export function registerReducer(newReducers) {
  reducerMap = { ...reducerMap, ...newReducers };
  store.replaceReducer(combineReducers(reducerMap));
  return getStore();
}

export function getStateAtNs(state, ns) {
  // store.getState() to replace the param state?
  const nsState = state[ns];
  if (!nsState) {
    throw new Error(
      `Attempted to access state for an unregistered namespace at key ${ns}`
    );
  }

  return nsState;
}
