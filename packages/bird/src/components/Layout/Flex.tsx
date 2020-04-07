import React from "react";
interface IFlexProps {
  layout: [];
  padding: string;
  children: any;
}
export default function Flex(props: IFlexProps) {
  const { children } = props;
  const count = React.Children.count(children);

  let { layout: rawLayout, padding = 0, gap = 0 } = props;
  let layout = rawLayout || [8, 8, 8];
  const layoutLength = layout.length;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", width: "100%", padding }}>
      {React.Children.map(children, (child, index) => {
        if (child == null) {
          return;
        }
        const { props: { spans: childSpans, ...childProps } = {} } =
          child || {};
        const spans = childSpans || layout[index % layoutLength];
        const width = ((spans * 1) / 24.0) * 100 + "%";
        return (
          <div style={{ width, padding: 0, marginBottom: gap }}>
            {child && React.cloneElement(child, childProps)}
          </div>
        );
      })}
    </div>
  );
}
