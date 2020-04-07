import React, { Component } from "react";
import _ from "lodash";

import { connect } from "@/storex";
import { actionCreators, NAMESPACE } from "./storex";

import { XForm } from "../components/Form";
import Ipt from "../components/Ipt";
import { Message, Spin } from "antd";

import Button from "../components/Button";

const { ButtonGroup } = Button;

import { getMappedParams } from "../utils";

import "./index.less";

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
export default class AForm extends React.Component {
  constructor(props) {
    super(props);
    const { actions } = props;
    this.actions = actions;

    this.handleFormChange = changedFields => {
      actions.changeFormData(changedFields);
    };
  }

  getPageConf() {
    return this.actions.getPageConf.start();
  }


  getDetail() {
    const {
      match: {
        params: { id }
      }
    } = this.props;
    if (id) {
      this.actions.getDetail.start({ id });
    }
  }

  componentDidMount() {
    this.actions.clearFormData();
    this.getPageConf()
      .then(([pageConfig = {}]) => {
        const {
          data: {
            template: {  }
          }
        } = pageConfig;
        this.actions.getOptions.start();
        this.getDetail();
      })
      .catch(e => {
        console.log("e:", e);
      });
  }

  componentWillUnmount() {
    this.actions.clearFormData();
  }

  goBack() {
    this.props.history.goBack();
  }

  render() {
    const {
      pageState: {
        pageConfig: { options, form: formFields = [] },
        form,
        loading
      }
    } = this.props;

    const {
      match: {
        params: { pageType }
      }
    } = this.props;

    const formDisabled = pageType === "view";
    const { auths = {} } = form;

    const decoratedFormFields = formFields.map(field => {
      const fieldExtras = {};
      fieldExtras.display = field[pageType] !== false;
      return {
        ...field,
        ...fieldExtras,
        disabled: formDisabled
      };
    });
    return (
      <Spin spinning={loading}>
        <XForm
          layout="vertical"
          fields={decoratedFormFields}
          data={form}
          formRef={form => (this.form = form)}
          provider={options}
          onChange={_.debounce(this.handleFormChange, 500)}
        />
        <ButtonGroup
          btns={[
            {
              title: "提交审核",
              type: "primary",
              display: !formDisabled,
              onClick: _.debounce(() => {
                this.form.validateFieldsAndScroll((err, values) => {
                  console.log("err:", err);
                  if (!err) {
                    this.actions.saveFormData
                      .start(values)
                      .then(result => {
                        const { errmsg } = result;
                        Message.success(errmsg);
                        this.goBack();
                      })
                      .catch(err => {
                        console.log(err);
                        Message.error(err.errmsg);
                      });
                  }
                });
              }, 1000)
            },
            {
              key: "pass",
              label: "通过",
              type: "primary",
              confirm: true,
              display: pageType === "view" && !!auths.audit,
              onClick: () => {
                this.actions.action
                  .start("pass", null, form)
                  .then(({ errmsg }) => {
                    Message.success(errmsg);
                    this.getDetail();
                  })
                  .catch(({ errmsg }) => Message.error(errmsg));
              }
            },
            {
              key: "reject",
              label: "驳回",
              display: pageType === "view" && !!auths.audit,
              type: "danger",
              confirm: true,
              onClick: () => {
                this.actions.action
                  .start("reject", null, form)
                  .then(({ errmsg }) => {
                    Message.success(errmsg);
                    this.getDetail();
                  })
                  .catch(({ errmsg }) => Message.error(errmsg));
              }
            },
            {
              title: "返回",
              onClick: () => this.goBack()
            }
          ]}
        />
      </Spin>
    );
  }
}
