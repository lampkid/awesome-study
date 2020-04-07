import React from "react";
import classnames from "classnames";

import { renderFieldValue } from "../utils";
// todo: 处理为更为通用的render, 而不仅仅是Table

import "./index.less";

export default function Detail({
  titleKey,
  fields = [],
  data = {},
  className,
  style,
  provider = {}
}) {
  return (
    <div className={classnames("x-detail", className)}>
      <div className="x-detail-block">
        <h2 className="x-detail-block-title">{data[titleKey]}</h2>
      </div>

      <div className="x-detail-fields">
        {fields.map((field, index) => {
          const { key, title, style: fieldStyle } = field;

          const txtContent = data[key];
            
          return (
            <span className="detail-item" style={{ ...style, ...fieldStyle }}>
              <label>{title}：</label>
              <span>
                {renderFieldValue(txtContent, data, index, field, provider)}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
