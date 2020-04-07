function createPayloadThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    const { payload, ...otherActionProps } = action;
    if (typeof payload === "function") {
      return next({
        ...otherActionProps,
        payload: action.payload(dispatch, getState, extraArgument)
      });
    }

    return next(action);
  };
}

const payloadThunk = createPayloadThunkMiddleware();
payloadThunk.withExtraArgument = createPayloadThunkMiddleware;

export default payloadThunk;
