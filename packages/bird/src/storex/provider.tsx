import React from "react";
import { Provider as ProviderRedux } from "react-redux";

import { getStore, startSaga } from "./store";

const store = getStore();
startSaga();

export function Provider({ children }) {
  return <ProviderRedux store={store}>{children}</ProviderRedux>;
}
