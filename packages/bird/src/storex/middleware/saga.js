import createSagaMiddleware from "redux-saga";
const sagaMiddleware = createSagaMiddleware();
export default sagaMiddleware;

import rootSaga from "../rootSaga";

export function startSaga() {
  sagaMiddleware.run(rootSaga);
}
