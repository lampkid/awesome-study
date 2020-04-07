import * as React from "react";
import * as ReactDOM from "react-dom";

import { message } from "antd";
import { Pagination, LocaleProvider } from "antd";
import zhCN from "antd/es/locale-provider/zh_CN";
/*
 * 设置日期中文，以让日期相关组件展示中文
 */
import moment from "moment";
import "moment/locale/zh-cn";

moment.locale("zh-cn");

import DefaultLayout from "@/layouts/default";

import env from "@/env";


// import { DefaultLayout } from '@/layouts';
// TS1128: Declaration or statement expected.
declare global {
  interface Window {
    apiPrefixUri: string;
    AuthPoints: {};
  }
}

import request from "@/utils/request";

request.setBaseUrl(window.apiPrefixUri || "");
request.addResponseMiddleware(response => {
  const {
    data: { errno, errmsg }
  } = response;
  if (errno !== 0) {
    message.error(errmsg);
  }
  return response;
});
import AppRouter from "@/router";

import { Provider } from "@/storex";
import { injectAuth } from "@/auth";

injectAuth({ ...window.AuthPoints });

import "./index.less";

ReactDOM.render(
  <>
    <Provider>
      <LocaleProvider locale={zhCN}>
        <DefaultLayout header={true}>
          <AppRouter />
        </DefaultLayout>
      </LocaleProvider>
    </Provider>
  </>,
  document.getElementById("main")
);
