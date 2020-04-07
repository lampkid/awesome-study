import React from "react";
import Table from "../../Table";

import renders from "./ColumnRender";

import TableOperation, {
  setTableOperationConfig,
  registerTableOperation
} from "./TableOperation";
const tableConfig = {};
export default class SolutionTable extends React.Component {
  static registerTableOperation = registerTableOperation;
  static setTableOperationConfig = setTableOperationConfig;
  static registerRender = Table.registerRender;

  static injectTableConfig(newTableConfig) {
    Object.assign(tableConfig, newTableConfig);
  }

  render() {
    const { props } = this;
    return <Table {...tableConfig} {...props} />;
  }
}

Table.registerRender({
  operation: function(text, record, index, column, provider) {
    const { operations, operationRender } = column;
    const opProps = {
      record,
      index,
      operationRender,
      provider,
      operations
    };
    return <TableOperation {...opProps} />;
  },
  ...renders
});
