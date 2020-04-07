import { take, fork, call, put, all } from "redux-saga/effects";

import request from "@/utils/request";

function* watchAsyncAction() {
  while (true) {
    const action = yield take(action => action.type.match(/start$/));
    yield fork(handleAsyncAction, action);
  }
}

function execAction(payload) {
  return request(payload);
}

// todo: payload的结构设计
function* handleAsyncAction({ type: actionType, payload, resolve, reject }) {
  // todo: yield 触发before action, 如何在业务store自定义payload
  //
  // 这个代码更新loading后会导致loading时间长
  yield put({
    type: actionType.replace(/start$/, "before")
  });
  // todo: con & serial support & channel support
  const result = yield call(execAction, payload);
  let isSuccess = true;
  if (Array.isArray(result)) {
    isSuccess = result.every(({ errno }) => errno === 0);
  } else {
    isSuccess = result.errno === 0;
  }

  // todo: 自定义成功条件，可自定义成功和失败条件函数, 且可全局设置
  const always = put({
    type: actionType.replace(/start$/, "always"),
    payload: result
  });
  if (isSuccess) {
    yield all([
      put({
        type: actionType.replace(/start$/, "success"),
        payload: result
      }),
      always
    ]);
    yield call(resolve, result);
  } else {
    yield all([
      put({
        type: actionType.replace(/start$/, "failure"),
        payload: result
      }),
      always
    ]);

    yield call(reject, result);
  }

  // 这个代码更新loading后会导致loading时间长
  yield put({
    type: actionType.replace(/start$/, "finish"),
    payload: result
  });
}

export default function* rootSaga() {
  yield all([watchAsyncAction()]);
}
