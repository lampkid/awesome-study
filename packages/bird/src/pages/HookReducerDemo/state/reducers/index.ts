import * as ns1 from "./ns1";
import * as ns2 from "./ns2";
import * as ns3 from "./ns3";

function makeReducers(modules) {
  const initialState = {};
  const reducers = {};

  modules.forEach(({ NAMESPACE, initialState: state, reducer }) => {
    initialState[NAMESPACE] = state;
    reducers[NAMESPACE] = reducer;
  });

  return {
    initialState,
    reducers
  };
}

export default makeReducers([ns1,ns2, ns3]);
