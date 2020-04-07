import React from "react";
import { Table as AntdTable, Tooltip, Icon } from "antd";

import classnames from "classnames";

import _ from "lodash";
import "./index.less";

/*
 * @param columns * [
 *  {
 *    key: 'title',
 *    title: '文本',
 *    render: 'render' // 自定义渲染器, 可使用registerRender注册渲染器
 *  }
 * ]
 */

import compose from "../Solution/compose";

const tableColumns = {};

export const tableRenders = {};

export default class Table extends React.Component {
  /*
   * @param newRenders [render]
   *
   * render: {
   *  renderName: (text, record, index) => {
   *  }
   * }
   *
   */
  static registerRender(newRenders) {
    // 注册render可通过injectColumn实现
    Object.assign(tableRenders, newRenders);
  }

  /*
   * @param columnConfigs
   *
   * 向某列配置注入新属性
   */
  static injectColumn(columnConfigs) {
    Object.assign(tableColumns, columnConfigs);
  }

  getColumnTitle(title, titleTip, titleTipIcon = "question-circle") {
    const tip = Array.isArray(titleTip)
      ? titleTip.map((item, index) => (
          <p key={index}>
            {index + 1}. {item}
          </p>
        ))
      : titleTip;
    return (
      <div>
        {title}
        {titleTip && (
          <Tooltip title={tip}>
            <Icon type={titleTipIcon} />
          </Tooltip>
        )}
      </div>
    );
  }

  getNewColumns(columns) {
    const { provider = {} } = this.props;
    const finalColumns = [];
    columns.map(column => {
      const { key } = column;
      const newColumn = { key, ...column, ...tableColumns[key] };
      const {
        render: renderName,
        display,
        textKey = key,
        title,
        titleTip,
        titleTipIcon,
        ...otherColProps
      } = column;

      if (display !== false) {
        const finalColumn = {
          key,
          title: this.getColumnTitle(title, titleTip, titleTipIcon),
          dataIndex: key,
          ...otherColProps,
          render(text, record, index) {
            // todo: warning when record doesn't has the textKey
            const decoratedText =
              textKey && _.has(record, textKey) ? _.get(record, textKey) : text;
            if (Array.isArray(renderName)) {
              const funcs = renderName.map(renderItem => {
                const func =
                  typeof renderItem === "function"
                    ? renderItem
                    : tableRenders[renderItem];
                return func ? func : text => text;
              });

              const finalFunc = compose(funcs);
              return finalFunc.call(
                null,
                decoratedText,
                record,
                index,
                column,
                provider,
                tableRenders
              );
            } else if (renderName) {
              const render =
                typeof renderName === "function"
                  ? renderName
                  : tableRenders[renderName];
              if (typeof render === "function") {
                return render.call(
                  null,
                  decoratedText,
                  record,
                  index,
                  column,
                  provider,
                  tableRenders
                );
              }
            }
            return decoratedText;
          }
        };
        finalColumns.push(finalColumn);
      }
    });
    return finalColumns;
  }

  render() {
    const showTotal = (total, range) => {
      return `共${total}条`;
    };

    const {
      columns,
      pagination,
      locale,
      className,
      placeholder = "抱歉，暂无符合条件的查询结果",
      displayPlaceholder = true,
      ...otherProps
    } = this.props;

    const mergedPagination =
      typeof pagination === "boolean"
        ? pagination
        : {
            showSizeChanger: true,
            showTotal,
            ...pagination
          };
    return (
      <div className={`x-table-wrapper`}>
        <AntdTable
          className={classnames("x-table", className, {
            placeholder: displayPlaceholder
          })}
          pagination={mergedPagination}
          columns={this.getNewColumns(columns)}
          locale={{
            emptyText: placeholder,
            ...locale
          }}
          {...otherProps}
        />
      </div>
    );
  }
}
