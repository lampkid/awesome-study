import React, { useState } from "react";
import { Spin } from "antd";
export default function loading(Component: string | React.ComponentType<any>) {
  return function LoadingWrapper<P>(props: P) {
    const [loading, setLoading] = useState(false);
    const [tip, setTip] = useState();

    function setLoadingSpin(state: boolean, tip?: string) {
      setLoading(state);
      setTip(tip);
    }
    return (
      <Spin spinning={loading} tip={tip}>
        <Component {...props} setLoading={setLoadingSpin} />
      </Spin>
    );
  };
}
