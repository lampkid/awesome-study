import React, { createContext, useContext, useReducer } from "react";

import { default as stateReducer } from "./reducers";

import combineReducers from "./combineReducers";

const { initialState, reducers } = stateReducer;

const reducer = combineReducers(reducers);

const context = createContext(initialState);

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <context.Provider value={{ state, dispatch }}>{children}</context.Provider>
  );
};
const contextConsume = () => {
  return useContext(context);
};

export { Provider, contextConsume };
