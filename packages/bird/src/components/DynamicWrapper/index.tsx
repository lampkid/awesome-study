import React, { Suspense } from "react";
export default function dynamicWrapper(
  component: string | React.ComponentType<any>
) {
  // todo: 判断component为string还是component
  const Comp =
    component instanceof React.Component || typeof component === "function"
      ? component
      : React.lazy(() =>
          import(/* webpackChunkName: "[request]" */ `@/pages/${component}`)
        );

  return function Wrapper<P>(props: P) {
    return (
      <Suspense fallback={<div>loading...</div>}>
        <Comp {...props} />
      </Suspense>
    );
  };
}
