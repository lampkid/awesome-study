/*
 * 一个容器有多行BlockRow, 每个BlockRow占容器100%
 * 一个BlockRow有多列Block，每个Block高度占满BlockRow的高度，宽度由BlockRow的layout=[8,8,8]指定各Block宽度占比
 * 一个Block内由栅格布局，包括多少行多少列 * {
 *  children: [
 *    {
 *      //blockRow
 *      layout: [8,8,8]
 *      children: [
 *        {
 *          // block
 *          children: [
 *            {
 *              // row
 *              children: [
 *                8, 8, 8
 *              ]
 *            },
 *            {
 *              // row
 *              children: [
 *                8,8,8 // 一行分三列
 *              ]
 *            }
 *          ]
 *
 *        },
 *        {
 *          //block
 *        },
 *        {
 *        }
 *      ]
 *    },
 *    {
 *    }
 *  ]
 * }
 */

import React from "react";
import groupFields from "./group";
import orderFields from "./order";
import Flex from "./Flex";

interface IBlockLayoutProps {
  children: React.ComponentClass[];
  layoutConfig: {};
}

export default function BlockLayout(props: IBlockLayoutProps) {
  const { children, layoutConfig = {} } = props;
  const finalChildren: [] = [];
  React.Children.map(children, child => {
    if (child) {
      const { fieldPlacement, ...childProps } = child.props;
      const finalChild = {
        element: React.cloneElement(child, childProps),
        ...fieldPlacement
      };
      finalChildren.push(finalChild);
    }
  });
  const components = groupFields(orderFields(finalChildren), true);
  // console.log('layoutConfig:', layoutConfig)
  return (
    <Flex layout={[24]}>
      {components.map((blockRow, blockRowIndex) => {
        // 获取当前blockRow的布局配置
        const {
          children: rootChildren = [],
          mode = "grid",
          blockRowLayout
        } = layoutConfig; // mode: grid/flow
        const blockRowConfig = rootChildren[blockRowIndex] || {};
        const blockRowChildren = blockRowConfig.children || [];
        const blockRowLayout = blockRowLayout || blockRowConfig.layout || [24]; //block row 下的blocks各占多少列

        // console.log('blockRowConfig:', blockRowConfig);
        const blockCount = blockRow.length;
        return (
          <Flex key={blockRowIndex} layout={blockRowLayout}>
            {blockRow.map((block, blockIndex) => {
              const blockConfig = blockRowChildren[blockIndex] || [24];
              return mode === "grid" ? (
                <GridBlock
                  key={blockIndex}
                  components={block}
                  blockConfig={blockConfig}
                />
              ) : (
                <FlowBlock
                  key={blockIndex}
                  components={block}
                  blockConfig={blockConfig}
                />
              );
            })}
          </Flex>
        );
      })}
    </Flex>
  );
}

interface IGridBlockProps {
  components: React.ComponentType[];
  blockConfig: {};
}

type IFlowBlockProps = IGridBlockProps;

/*
 * 获取某列的宽度
 * 如果当前行只有一列，占满一行
 */
function getSpans(colsLength, colIndex, rowLayout) {
  let span;
  /*
  if (colsLength <= 1) {
    span = 24;
  } else if (colIndex % 2 === 0) {
    span = 8;
  } else {
    span = 16;
  }

  if (colsLength > 1) {
    span = (Array.isArray(rowLayout) && rowLayout[colIndex]) || span;
  }
  */
  return span;
}

function getRowLayout(colsLength: number) {
  return new Array(colsLength).fill(24.0 / colsLength);
}

function FlowBlock(props: IFlowBlockProps) {
  const { components: rows, blockConfig } = props;
  // console.log('blockConfig:', blockConfig)
  const { title: blockTitle, children: rowsConfig = [] } = blockConfig;
  return (
    <>
      {blockTitle}
      {rows.map((cols, rowIndex) => {
        const rowConfig = rowsConfig[rowIndex] || {};
        // console.log('row config:', rowConfig)
        const { children: colsLayout = [8, 8, 8] } = rowConfig;
        return (
          <Flex key={rowIndex} layout={colsLayout}>
            {cols
              .map((col, colIndex) => {
                const fields = col;
                return fields.map(field => field.element);
              })
              .flat()}
          </Flex>
        );
      })}
    </>
  );
}

function GridBlock(props: IGridBlockProps) {
  const { components: rows, blockConfig } = props;
  // console.log('blockConfig:', blockConfig)
  const { title: blockTitle, children: rowsConfig = [] } = blockConfig;
  return (
    <>
      {blockTitle}
      {rows.map((cols, rowIndex) => {
        const rowConfig = rowsConfig[rowIndex] || {};
        // console.log('row config:', rowConfig)
        const { children: colsLayout = getRowLayout(cols.length) } = rowConfig;
        return (
          <Flex key={rowIndex} layout={colsLayout}>
            {cols.map((col, colIndex) => {
              const fields = col;
              return (
                <div key={colIndex}>{fields.map(field => field.element)}</div>
              );
            })}
          </Flex>
        );
      })}
    </>
  );
}
