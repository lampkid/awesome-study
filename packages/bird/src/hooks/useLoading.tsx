import React, { useState } from "react";
import { Spin } from "antd";

function Loading({ children, loading, tip }) {
  return (
    <Spin spinning={loading} tip={tip}>
      {children}
    </Spin>
  );
}
function useLoading() {
  const [loading, setLoading] = useState(false);
  const [tip, setTip] = useState();

  function setLoadingSpin(state: boolean, tip?: string) {
    setLoading(state);
    setTip(tip);
  }

  return [
    ({ children }) => (
      <Loading loading={loading} tip={tip}>
        {children}
      </Loading>
    ),
    setLoadingSpin,
    loading
  ];
}

export default useLoading;
