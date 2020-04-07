import React, { Fragment, Component } from "react";
import _ from "lodash";
import qs from "qs";
import moment from "moment";

const pathToRegexp = require("path-to-regexp");

import { connect } from "@/storex";
import { actionCreators, NAMESPACE } from "./storex";

import Table from "@/components/Solution/Table";

import { Message, Spin } from "antd";

import { getAuth } from "../components/Solution/auth";

import { isFirstAccess } from "../components/Solution/history";

import Modal from "../components/Modal";
import { XForm } from "../components/Form";
import Detail from "../components/Solution/Detail";

import Button from "../components/Button";

const { ButtonGroup } = Button;

import { formatSearch, getMappedParams, getApi } from "../utils";
import request from "../utils/request";

import "./index.less";
import { func } from "prop-types";

/*
 * @param pageState
 * 结构参考reducer
 */

@connect(
  ({ [NAMESPACE]: pageState }) => {
    return {
      pageState
    };
  },
  actionCreators
)
export default class AList extends Component {
  constructor(props) {
    super(props);
    const { actions } = props;
    this.actions = actions;
    // 处理搜索输入
    this.handleFormChange = changedFields => {
      actions.changeSearch(changedFields);
    };

    this.handleModalFormChange = changedFields => {
      actions.changeFormData(changedFields);
    };

    // 处理分页
    this.handleTableChange = pagination => {
      const { current: page, pageSize } = pagination;
      /*
       * 以下这两部分通过saga如何实现
       * 目前是通过payloadThunk middleware实现，search时从getState拿到changePagination最新数据
       */
      this.actions.changePagination({ page, pageSize });
      this.search();
    };

    // 初始化state
    this.setPageConfig(props);

    // todo: setxxx or registerxxx 考虑用namespace或页面区分或全局,以防止互相影响
    Table.setTableOperationConfig({
      operationRender(record, { key: operationKey, authKey, auth }) {
        const { auths = {} } = record;
        if (typeof auth === "boolean") {
          return auth;
        }
        return auths[operationKey] || auths[authKey];
      }
    });

  }

  search() {
    // done: 返回promise
    this.formRef &&
      this.formRef.validateFields(err => {
        if (!err) {
          const routeParams = this.getRouteParams();
          return this.actions.getlist
            .start(routeParams)
            .catch(e => console.log(e));
        }
      });
  }

  registerTableOperations(props) {
    // 注册列表操作动作
    const {
      pageState: { pageConfig: { tableOp = [] } = {} }
    } = props;
    const tableOpRegisters = tableOp.reduce((prevRegisters, op) => {
      const { type, key, title, label = title } = op;
      if (type === "action") {
        return {
          ...prevRegisters,
          [key]: record => {
            this.actions.action
              .start(key, null, record)
              .then(({ errmsg }) => {
                Message.success(`${label}成功`);
                this.search();
              })
              .catch(({ errmsg }) => Message.error(errmsg || `${label}失败`));
          }
        };
      } else if (type === "modal") {
        return {
          ...prevRegisters,
          [key]: record => {
            this.actions.showModalForm(key, record);
          }
        };
      } else {
        return prevRegisters;
      }
    }, {});
    Table.registerTableOperation(tableOpRegisters);
  }

  setPageConfig(props) {
    // todo: 最好在render获取,获取最新的
    const {
      pageState: {
        pageConfig: { search, table, searchOp, form = [] }
      }
    } = props || this.props;
    this.searchFields = search;
    this.tableColumns = table;
    this.searchOpProps = this.getSearchOpProps(searchOp);
    this.formFields = form;
  }

  reset() {
    this.setDefaultSearch();
  }

  getDefaultSearch() {
    return this.searchFields.reduce(
      (prevValues, { defaultValue, key, type }) => {
        let value = defaultValue;
        if (
          ["date-range", "datetime-range"].includes(type) &&
          defaultValue === "1-years"
        ) {
          value = [
            moment()
              .subtract(1, "years")
              .format("YYYY-MM-DD"),
            moment().format("YYYY-MM-DD")
          ];
        }
        return {
          ...prevValues,
          [key]: value
        };
      },
      {}
    );
  }

  setDefaultSearch() {
    const defaultSearch = this.getDefaultSearch();
    // todo: 下面两行代码是不生效的，changeSearch后，search在下一次组件render才能拿到store里的值
    // done: 通过payloadThunk middleware解决
    this.actions.changeSearch(defaultSearch);
    this.search();
  }

  getPageConf() {
    // return this.actions.getPageConf.start();
    return new Promise((resolve, reject) => {
      this.actions.getPageConfLocal();
      resolve();
    });

  }

  componentDidMount() {
    const { location } = this.props;
    // done: 回到该页面保留搜索条件
    // 统计进入该路由的次数
    this.getPageConf()
      .then(() => {
        this.setPageConfig();
        const {
          pageState: {
            pageConfig: { api: { options, con } = {} }
          },
          match: { params }
        } = this.props;
        if (options) {
          this.actions.getOptions.start();
        }
        if (con) {
          this.actions.concurrentRequest.start(params);
        }
        this.registerTableOperations(this.props);
        if (isFirstAccess(location)) {
          this.reset();
        } else {
          this.search();
        }
      })
      .catch(e => {
        console.log("e:", e);
      });
  }

  getRouteParams() {
    const {
      match: { params: routeParams = {} }
    } = this.props;

    return Object.keys(routeParams).reduce((formatParams, key) => {
      const rawValue = routeParams[key];
      const value =
        typeof rawValue === "string" && /\d+/.test(rawValue)
          ? +rawValue
          : rawValue;
      return {
        ...formatParams,
        [key]: value
      };
    }, {});
  }

  makeDownloadURL() {
    const {
      pageState: {
        pageConfig,
        pageConfig: { search: searchFields, searchKey },
        search
      }
    } = this.props;
    const routeParams = this.getRouteParams();
    const { url: path, params } = getApi(
      pageConfig,
      "download",
      { [searchKey]: formatSearch(search, searchFields) },
      routeParams
    );

    const allParams = { ...params, ...routeParams };
    const newPath = pathToRegexp.compile(path)(allParams);

    const { baseURL = "" } = request.getConfig();
    const sep = newPath.indexOf("?") !== -1 ? "&" : "?";
    const reqParams = Object.keys(params).reduce((prevMap, key) => {
      return {
        ...prevMap,
        [key]: _.isPlainObject(params[key])
          ? JSON.stringify(params[key])
          : params[key]
      };
    }, {});
    const finalURL = `${baseURL.replace(
      /^\/api/g,
      "/download"
    )}${newPath}${sep}${qs.stringify(reqParams)}`;
    return finalURL;
  }

  getSearchOpProps(remoteSearchOpProps) {
    const handlerMap = {
      search: () => {
        this.actions.changePagination({ page: 1 });
        this.search();
      },
      reset() {
        this.reset();
      },
      download() {
        window.open(this.makeDownloadURL());
      },
      create() {
        //  this.props.history.push("/create");
        this.actions.showModalForm('create', {});
      }
    };

    const { btns = [], ...otherSearchProps } = remoteSearchOpProps;

    const auths = getAuth();

    const decoratedSearchOpProps = {
      btns: btns.map(btn => {
        let handler = handlerMap[btn.key];
        if (!handler) {
          console.log("search op handler undefined");
          handler = function() {};
        }
        const bindHandler = handler.bind(this);
        return {
          ...btn,
          display: auths[btn.key],
          onClick: bindHandler
        };
      }),
      ...otherSearchProps
    };
    return decoratedSearchOpProps;
  }

  render() {
    const {
      pageState: { list, search, pagination }
    } = this.props;

    const {
      pageState: {
        form,
        modal: { visible, type, title },
        formDisabled,
        detail: detailData = {}
      }
    } = this.props;

    const {
      pageState: {
        pageConfig: {
          rowKey,
          options,
          search: searchFields = [],
          detail: { titleKey, fields: detailFields = [] } = {}
        },
        loading
      }
    } = this.props;
    const { history } = this.props;
    //
    const label = searchFields && searchFields.length === 0 ? "" : " ";

    // todo: 其实可以使用子路由
    return (
      <Fragment>
        <Spin spinning={loading}>
          <div className="page-header">
            <Detail
              titleKey={titleKey}
              fields={detailFields}
              data={detailData}
            />
          </div>
          <div className="search-panel">
            <XForm
              formRef={form => (this.formRef = form)}
              layout="inline"
              data={search}
              dataBased
              onChange={_.debounce(this.handleFormChange, 500)}
            >
              {(form, values) => (
                <XForm.FormGroup
                  fields={this.searchFields}
                  provider={options}
                  form={form}
                >
                  <XForm.Item
                    label={label}
                    colon={false}
                    className="x-form-item-vertical"
                  >
                    <ButtonGroup
                      className="list-search-ops"
                      {...this.searchOpProps}
                    />
                  </XForm.Item>
                </XForm.FormGroup>
              )}
            </XForm>
          </div>
          <Table
            rowKey={rowKey}
            dataSource={list}
            columns={this.tableColumns}
            provider={options}
            onChange={this.handleTableChange}
            pagination={{
              ...pagination,
              current: pagination.page,
              pageSizeOptions: ["10", "20", "50", "100"]
            }}
          />
          <Modal
            width={500}
            height={300}
            visible={visible}
            title={title}
            onCancel={() => this.actions.hideModalForm()}
            btns={[
              {
                title: "提交审核",
                type: "primary",
                onClick: () => {
                  this.modalForm.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                      this.actions.saveFormData
                        .start(values)
                        .then(result => {
                          const { errmsg } = result;
                          // todo: 提示信息有三种方式可以提示
                          // 1. 在请求返回的promise中，组件层面，比如此处
                          // 2. 处理请求成功时的reducer里, store的逻辑中引入组件，层次不清晰
                          // 3. redux中间件统一处理：不好确定哪些请求需要提示，无法公用
                          Message.success(errmsg);
                          this.search();
                          this.actions.hideModalForm();
                        })
                        .catch(({ errmsg }) => {
                          Message.error(errmsg);
                        });
                    }
                  });
                }
              },
              {
                title: "取消",
                onClick: () => this.actions.hideModalForm()
              }
            ]}
          >
            <Spin spinning={loading}>
              <XForm
                layout="horizontal"
                fields={this.formFields.map(field => ({
                  ...field,
                  disabled: formDisabled
                }))}
                data={form}
                formRef={form => (this.modalForm = form)}
                provider={options}
                onChange={_.debounce(this.handleModalFormChange, 500)}
              />
            </Spin>
          </Modal>
        </Spin>
      </Fragment>
    );
  }
}
