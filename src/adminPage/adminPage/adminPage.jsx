import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  AreaChartOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import AdminCategoryPage from "../AdminCategoryPage/AdminCategoryPage";
import AdminProductPage from "../AdminProductPage/AdminProductPage";
import AdminReviewPage from "../AdminReviewPage/AdminReviewPage";
import AdminUserPage from "../AdminUserPage/AdminUserPage";
const { Header, Sider, Content } = Layout;
const AdminPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [collapsed, setCollapsed] = useState(false);
  const [keySelect, setKeySelect] = useState("1");
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const renderContent = (key) => {
    switch (key) {
      case "1":
        return <>Thong ke</>;
      case "2":
        return <AdminCategoryPage />;
      case "3":
        return <AdminProductPage />;

      case "4":
        return <AdminUserPage />;

      case "5":
        return <AdminReviewPage />;

      default:
        return <></>;
    }
  };
  return (
    <Layout className="h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        // className="h-screen"
      >
        <div className="logo text-white p-6 flex items-center justify-start">
          <UserOutlined style={{ fontSize: "30px" }} />
          {collapsed ? undefined : (
            <span className="text-xl m-1">{userInfo?.name}</span>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          onClick={({ key }) => {
            setKeySelect(key);
          }}
          items={[
            {
              key: "1",
              icon: <AreaChartOutlined />,
              label: "Thống kê",
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: "Danh mục sản phẩm",
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: "Sản phẩm",
            },
            {
              key: "4",
              icon: <UploadOutlined />,
              label: "Người dùng",
            },
            {
              key: "5",
              icon: <UploadOutlined />,
              label: "Bình luận",
            },
          ]}
        />
      </Sider>

      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          {renderContent(keySelect)}
        </Content>
      </Layout>
    </Layout>
  );
};
export default AdminPage;
