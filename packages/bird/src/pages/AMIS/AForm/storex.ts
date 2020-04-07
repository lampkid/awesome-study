/*
 * todo: immutable
 * todo: reselect
 */
import { createActions, handleActions, registerReducer } from "@/storex";
export const NAMESPACE = "AForm";

import {
  getMappedParams,
  getPageConfURL,
  getApi as getApiByPageConfig,
  formatSearch
} from "../utils";
import { formatData } from "../utils";

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
    CHANGE_FORM_DATA: undefined,
    $GET_OPTIONS: params => (dispatch, getState) => {
      const apiAction = getApi(getState(), "options", params);
      return apiAction;
    },
    $GET_DETAIL: ({ id }) => (dispatch, getState) => {
      // getPageConf后调用获取rowKey
      const state = getState();
      const rowKey = getRowKey(state);
      // todo: 增加数据获取后的format钩子
      return getApi(state, "detail", { [rowKey]: id });
    },
    $SAVE_FORM_DATA: formData => (dispatch, getState) => {
      const state = getState();
      const ROW_KEY = getRowKey(state);
      const {
        [NAMESPACE]: {
          form: { [ROW_KEY]: id },
          pageConfig: { form: formFields = [] }
        }
      } = state;
      const params = { ...formatData(formData, formFields), id };
      // const params = { ...formData, [ROW_KEY]:id };

      return getApi(state, "save", params);
    },
    $ACTION: (action, status, record) => (dispatch, getState) => {
      const ROW_KEY = getRowKey(getState());
      const params = {
        status,
        [ROW_KEY]: record[ROW_KEY]
      };
      return getApi(getState(), action, params, { row: record });
    },
    CLEAR_FORM_DATA: undefined
  },
  NAMESPACE
);

const reducers = handleActions(
  {
    [actionCreators.getPageConf.success]: (state, action) => {
      const [{ data: { template: pageConfig = {} } = {} }] = action.payload;
      const { options, ...pageFieldsConfig } = pageConfig;
      return {
        ...state,
        pageConfig: {
          ...pageFieldsConfig,
          options: {
            ...state.pageConfig.options,
            ...options
          }
        }
      };
    },
    // todo: loading 多个页面可以做一个公共的store和reducer, 也可以用combineActions将多个action的处理逻辑combine到一块
    [actionCreators.getPageConf.before]: (state, action) => ({
      ...state,
      loading: true
    }),
    [actionCreators.getPageConf.always]: (state, action) => ({
      ...state,
      loading: false
    }),

    [actionCreators.changeFormData]: (state, action) => ({
      ...state,
      form: { ...state.form, ...action.payload }
    }),

    [actionCreators.getDetail.success]: (state, action) => {
      // todo: 转化详情相应的字段到form // 编辑用
      const { data } = action.payload;
      const {
        pageConfig: { form = [] }
      } = state;
      const paramsMap = form.reduce(
        (prevMap, { key: targetKey, ownValueKey: sourceKey = targetKey }) => ({
          ...prevMap,
          [targetKey]: sourceKey
        }),
        {}
      );
      return {
        ...state,
        form: { ...data, ...getMappedParams({ paramsKeyMap: paramsMap }, data) }
      };
    },

    [actionCreators.getDetail.before]: (state, action) => ({
      ...state,
      loading: true
    }),
    [actionCreators.getDetail.always]: (state, action) => ({
      ...state,
      loading: false
    }),

    [actionCreators.getOptions.success]: (state, action) => {
      const apiResponseList = action.payload;
      const {
        pageConfig: {
          api: { options = [] }
        }
      } = state;
      const optionsFromApi = apiResponseList.reduce(
        (prevOptions, apiRes, index) => {
          const { key } = options[index];
          const { data = {} } = apiRes;
          const { list = [] } = data;
          // todo: 先判断有无list，有list取list, 无list取data, 后续通过api选项配置
          return {
            ...prevOptions,
            [key]: list ? list : data
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
    [actionCreators.saveFormData.before]: (state, action) => ({
      ...state,
      loading: true
    }),
    [actionCreators.saveFormData.always]: (state, action) => ({
      ...state,
      loading: false
    }),
    [actionCreators.clearFormData]: (state, action) => ({
      ...state,
      form: {}
    })
  },
  {
    pageConfig: {
      rowKey: "id",
      options: {},
      api: {}
    },
    form: {
      // 表单数据
    },
    formDisabled: false,
    loading: false
  },
  undefined
);

// todo: 用reselect实现computed, 通过mapStateToProps将computed和state都map到props里
// connectcomputed，可传入state和props供computed函数使用

registerReducer({ [NAMESPACE]: reducers });
