import switchCase from "../../utils/switchCase";

export const NAMESPACE = "ns1";

export const initialState = {
  value: 1
};

export function reducer(state = initialState, action: TAction) {
  const newState = switchCase({
    updateState: () => {
      const value  = action.payload;
      return {
        ...state,
        value
      };
    },
    reset: () => initialState
  })(state)(action.type, NAMESPACE);
  return newState;
}
