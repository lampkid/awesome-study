import React from "react";

import { Tooltip } from "antd";

const prefix = "x-design-ellipsis";

import "./index.less";

export default function Ellipsis({
  max = 20, // 最多显示多少个字
  title,
  content // 内容
}) {
  content = typeof content === "number" ? `${content}` : content;
  const truncatedContent =
    typeof content === "string" && content.length > max
      ? `${content.slice(0, max)}...`
      : content;
  return (
    <Tooltip
      title={<div className={`${prefix}-content-wrap`}>{content}</div>}
      className={`${prefix}`}
    >
      {title || truncatedContent}
    </Tooltip>
  );
}
