/*
 * todo: immutable
 * todo: reselect
 */

import { createActions, handleActions, registerReducer } from "@/storex";

// todo: 如何动态设置namespace？
export const NAMESPACE = "AList";

import { getApi as getApiByPageConfig, formatSearch } from "../utils";

import localPageConfig from './page.json';

function getRowKey(state) {
  const {
    [NAMESPACE]: {
      pageConfig: { rowKey }
    }
  } = state;
  return rowKey;
}

function getApi(state, action, params, paramsSource) {
  const {
    [NAMESPACE]: { pageConfig }
  } = state;

  return getApiByPageConfig(pageConfig, action, params, paramsSource);
}

export function getRowKeyByPageState(pageState) {
  const {
    pageConfig: { rowKey }
  } = pageState;
  return rowKey;
}

const pageConfigURL = '';

export const actionCreators = createActions(
  {
    $GET_PAGE_CONF: params => [{ url: pageConfigURL, params }],
    GET_PAGE_CONF_LOCAL: (params) => ({
      ...localPageConfig
    }),

    $GET_OPTIONS: params => (dispatch, getState) => {
      const apiAction = getApi(getState(), "options", params);
      return apiAction;
    },
    $CONCURRENT_REQUEST: paramsSource => (dispatch, getState) => {
      const apiAction = getApi(getState(), "con", null, paramsSource);
      return apiAction;
    },
    $GETLIST: paramsSource => (dispatch, getState) => {
      const {
        [NAMESPACE]: {
          pageConfig: { search: searchFields = [], searchKey },
          search,
          pagination: { page, pageSize }
        }
      } = getState();
      const params = {
        [searchKey]: formatSearch(search, searchFields),
        page,
        page_size: pageSize
      };
      return getApi(getState(), "search", params, paramsSource);
    },
    CHANGE_SEARCH: undefined,
    CLEAR_SEARCH: undefined,
    CHANGE_PAGINATION: undefined,

    CHANGE_FORM_DATA: undefined,
    CLEAR_FORM_DATA: undefined,
  SHOW_MODAL_FORM: (modalType, currentItem = {}) => (dispatch, getState) => {
    const state = getState();
    const ROW_KEY = getRowKey(state);
    const { [ROW_KEY]: id } = currentItem;
    const { [NAMESPACE]: { pageConfig: { actionTextMap } } } = getState();

    const allActionTextMap = {
      'view': `查看详情-${id}`,
      'create': '新建',
      'edit': `编辑-${id}`,
      'copy': `从记录${id}复制`,
      ...actionTextMap,
    };

    return {
      modal: { type: modalType, title: allActionTextMap[modalType] },
      form: currentItem,
      formDisabled: modalType === 'view'
    };
  },
    HIDE_MODAL_FORM: undefined,
    $SAVE_FORM_DATA: formData => (dispatch, getState) => {
      // todo: 使用formData还是getState里的form数据？详情数据和form数据是否要分开放？各的利弊
      // form可理解为当前操作的currentItem, 可通过列表获取也可以通过详情接口获取
      const state = getState();
      const ROW_KEY = getRowKey(state);
      const {
        [NAMESPACE]: {
          form: { [ROW_KEY]: id },
          modal: { type }
        }
      } = state;
      const params = { ...formData, id };
      return getApi(state, type, params);
    },
    // 可以统一定义一个acion， 调用时传入action名, 比如this.actions.action.start('edit')
    $ACTION: (action, status, record) => (dispatch, getState) => {
      const ROW_KEY = getRowKey(getState());
      const params = {
        [ROW_KEY]: record[ROW_KEY]
      };
      return getApi(getState(), action, params);
    }
  },
  NAMESPACE
);

// todo: 如何合并调用多次handleActions生成的reducer
// 即可按功能分块写reducers
const reducers = handleActions(
  {
    [actionCreators.getPageConf.success]: (state, action) => { // remote
    // [actionCreators.getPageConfLocal]: (state, action) => { // local  // todo: support two reducer names 
      const [
        {
          data: { template: { options, table = [], ...pageFieldsConfig } = {} }
        }
      ] = action.payload;
      const tableOpField = table.filter(tableField => {
        const { render } = tableField;
        if (render === "operation") {
          return true;
        }
      });
      const { operations: tableOp = [] } = tableOpField[0] || {};
      const actionTextMap = tableOp.reduce(
        (prevMap, { label, key }) => ({ ...prevMap, [key]: label }),
        {}
      );
      return {
        ...state,
        pageConfig: {
          ...state.pageConfig,
          table,
          tableOp,
          actionTextMap,
          options: {
            ...state.pageConfig.options,
            ...options
          },
          ...pageFieldsConfig
        }
      };
    },
  [actionCreators.getPageConfLocal]: (state, action) =>  {
    const { options, table = [], ...pageFieldsConfig } = action.payload;
    const tableOpField = table.filter(tableField => {
      const { render } = tableField;
      if(render === 'operation') {
        return true;
      }
    });
    const { operations: tableOp = []}= tableOpField[0] || {};
    const actionTextMap = tableOp.reduce((prevMap, { label, key }) => ({ ...prevMap, [key]: label }), {}); 
    return {
      ...state,
      pageConfig: { 
        ...state.pageConfig,
        table,
        tableOp,
        actionTextMap,
        options: {
          ...state.pageConfig.options,
          ...options
        },
        ...pageFieldsConfig,
      }
    };  
  },

    // todo: 设计一个更通用的并发action，不仅可以请求多个options，也可以请求其他接口, 比如详情数据接口
    [actionCreators.getOptions.success]: (state, action) => {
      // todo: 实现options分组拉取，可在不同时机拉取，比如弹窗时
      const apiResponseList = action.payload;
      const {
        pageConfig: {
          api: { options: optionsApi = [] }
        }
      } = state;
      const optionsFromApi = apiResponseList.reduce(
        (prevOptions, apiRes, index) => {
          const { key } = optionsApi[index];
          const { data = {} } = apiRes;
          const { list } = data;
          // done: 先判断有无list，有list取list, 无list取data, 后续通过api选项配置
          let newOptions = list ? list : data;
          if (typeof newOptions !== "undefined") {
            newOptions = key ? { [key]: newOptions } : newOptions;
          }
          return {
            ...prevOptions,
            ...newOptions
          };
        },
        {}
      );
      return {
        ...state,
        pageConfig: {
          ...state.pageConfig,
          options: {
            ...state.pageConfig.options,
            ...optionsFromApi
          }
        }
      };
    },
    [actionCreators.concurrentRequest.success]: (state, action) => {
      const apiResponseList = action.payload;
      const {
        pageConfig: {
          api: { con: conApi = [] }
        }
      } = state;
      const conData = apiResponseList.reduce((prevData, apiRes, index) => {
        const { key } = conApi[index];
        const { data = {} } = apiRes;
        return {
          prevData,
          [key]: data // todo: 通过dottedKey和lodash支持options
        };
      }, {});
      return {
        ...state,
        ...conData
      };
    },
    [actionCreators.getPageConf.before]: (state, action) => ({
      ...state,
      loading: true
    }),
    [actionCreators.getPageConf.always]: (state, action) => ({
      ...state,
      loading: false
    }),
    [actionCreators.getlist.before]: (state, action) => ({
      ...state,
      loading: true
    }),
    [actionCreators.getlist.success]: (state, action) => ({
      ...state,
      list: (action.payload.data && action.payload.data.list) || [],
      pagination: { ...state.pagination, total: action.payload.data.total }
    }),
    [actionCreators.getlist.always]: (state, action) => ({
      ...state,
      loading: false
    }),
    [actionCreators.changeSearch]: (state, action) => {
      return {
        ...state,
        search: { ...state.search, ...action.payload }
      };
    },
    [actionCreators.changePagination]: (state, action) => {
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload }
      };
    },
    [actionCreators.clearSearch]: (state, action) => ({
      ...state,
      search: {}
    }),

    [actionCreators.changeFormData]: (state, action) => ({
      ...state,
      form: { ...state.form, ...action.payload }
    }),

    [actionCreators.clearFormData]: (state, action) => ({
      ...state,
      form: {}
    }),
    [actionCreators.showModalForm]: (state, action) => ({
      ...state,
      modal: { ...state.modal, visible: true, ...action.payload.modal },
      form: action.payload.form,
      formDisabled: action.payload.formDisabled
    }),
    [actionCreators.hideModalForm]: (state, action) => ({
      ...state,
      modal: { ...state.modal, visible: false, ...action.payload }
    }),
    [actionCreators.saveFormData.before]: (state, action) => ({
      ...state,
      loading: true
    }),
    [actionCreators.saveFormData.always]: (state, action) => ({
      ...state,
      loading: false
    })
  },
  {
    pageConfig: {
      rowKey: "id",
      searchKey: "filter",
      search: [],
      table: [],
      options: {},
      searchOp: {
        btns: []
      },
      tableOp: {},
      api: {},
      actionTextMap: {}
    },
    list: [],
    search: {},
    pagination: {
      pageSize: 10,
      page: 1,
      total: 0
    },
    modal: {
      type: "create",
      visible: false
    },
    form: {
      // 弹窗表单数据
    },
    formDisabled: false,
    loading: false
  },
  undefined
);

// todo: 用reselect实现computed, 通过mapStateToProps将computed和state都map到props里
// connectcomputed，可传入state和props供computed函数使用

registerReducer({ [NAMESPACE]: reducers });
