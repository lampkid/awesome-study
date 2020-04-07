import React from "react";

import { Layout} from "antd";

const { Content } = Layout;




import "./default.less";

// feat: Layout and side menu
class DefaultLayout extends React.Component {
  render() {
    return (
      <Layout className="app-layout-default">
        <Layout>
          <Content
            style={{
              margin: "16px 20px 20px 20px",
              padding: "16px 0",
              background: "#fff",
              minHeight: 280
            }}
          >
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default DefaultLayout;
