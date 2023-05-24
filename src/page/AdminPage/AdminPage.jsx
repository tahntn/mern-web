import { Button, Layout, Menu, Result, theme } from "antd";
import React, { useState } from "react";
import { getItem } from "../../utils/index";
import {
  UserOutlined,
  AppstoreOutlined,
  AreaChartOutlined,
  CommentOutlined,
  ClusterOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import AdminUser from "../../component/AdminUser/AdminUser";
import { useDispatch, useSelector } from "react-redux";
import AdminProduct from "../../component/AdminProduct/AdminProduct";
import AdminOrder from "../../component/AdminOrder/AdminOrder";
import AdminReview from "../../component/AdminReview/AdminReview";
import AdminStatistical from "../../component/AdminStatistical/AdminStatistical";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonComponent from "../../component/ButtonComponent/ButtonComponent";
import logo1 from "../../assets/images/logo (5).png";
import { BiLogOut } from "react-icons/bi";
import { resetUser } from "../../features/auth/authSlice";
import * as UserService from "../../service/UserService";
import AdminCategory from "../../component/AdminCategory/AdminCategory";
const { Header, Content, Sider } = Layout;
const AdminPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { name, avatar, isAdmin, access_token } = useSelector(
    (state) => state.auth
  );
  const [collapsed, setCollapsed] = useState(false);
  const [keySelected, setKeySelected] = useState("");

  const items = [
    getItem("Thống kê", "statistical", <AreaChartOutlined />),
    getItem("Người dùng", "user", <UserOutlined />),
    getItem("Danh mục sản phẩm", "category", <AppstoreOutlined />),
    getItem("Sản phẩm", "product", <ClusterOutlined />),
    getItem("Đánh giá", "reviews", <CommentOutlined />),
    getItem("Đơn hàng", "orders", <ShoppingOutlined />),
  ];

  const renderPage = (key) => {
    switch (key) {
      case "user":
        return <AdminUser />;
      case "product":
        return <AdminProduct />;
      case "category":
        return <AdminCategory />;
        case "orders":
          return <AdminOrder />;
      case "reviews":
        return <AdminReview />;
      case "statistical":
        return (
          <AdminStatistical
            access_token={state?.access_token || access_token}
          />
        );
      default:
        return (
          <AdminStatistical
            access_token={state?.access_token || access_token}
          />
        );
    }
  };

  const handleOnCLick = ({ key }) => {
    setKeySelected(key);
  };

  return (
    <>
      {state?.role === "true" || isAdmin ? (
        <>
          <Layout hasSider>
            <Sider
             collapsible
             collapsed={collapsed}
             onCollapse={(value) => setCollapsed(value)}
              style={{
                overflow: "auto",
                height: "100vh",
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
              }}
            >
               <div
                style={{
                  height: 65,
                  padding: 12,
                  // margin: 16,
                  background: "rgba(255, 255, 255, 0.2)",
                }}
                className="flex items-center justify-center"
              >
                <>
                  {!collapsed && (
                    <div className=" h-full ">
                      <img
                        src={logo1}
                        alt="ảnh đại diện"
                        className="h-full object-cover rounded-full"
                      />
                    </div>
                  )}
                  {collapsed && (
                    <div className=" h-3/5 ">
                      <img
                        src={logo1}
                        alt="ảnh đại diện"
                        className="h-full object-cover rounded-full"
                      />
                    </div>
                  )}
                </>
              </div>
              <Menu
                theme="dark"
                mode="inline"
                style={{
                  maxHeight: "100vh",
                }}
                defaultSelectedKeys={["statistical"]}
                items={items}
                onClick={handleOnCLick}
              />
            </Sider>
            <Layout
              className="site-layout"
              style={
                !collapsed ? {
                  transform: "translateX(200px)", transition:" transform 0.2s ease-in-out", maxWidth: "calc(100% - 200px)"
                } : {
                  transform: "translateX(80px)", transition:" transform 0.2s ease-in-out",  maxWidth: "calc(100% - 80px)"
                }
                }
            >
              <Header className="bg-white flex py-3 items-center justify-end">
                {/* <div className="py-2 flex items-center justify-end"> */}
                <div className="h-full">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="ảnh đại diện"
                      className="h-full object-cover rounded-full"
                    />
                  ) : (
                    <img src={avatar} alt="ảnh đại diện" />
                  )}
                </div>
                <span className="text-white px-2">{name}</span>
                <BiLogOut
                  className="text-white text-2xl cursor-pointer"
                  onClick={async () => {
                    await UserService.logoutUser();
                    dispatch(resetUser());
                    navigate("/");
                  }}
                />
              </Header>
              <Content
                style={{
                  maxHeight: "100vh",
                }}
              >
                {/* <div style={{ flex: 1, padding: "15px" }}> */}
                {renderPage(keySelected)}
                {/* </div> */}
              </Content>
            </Layout>
          </Layout>

        
        </>
      ) : (
        <div className="h-full">
          <Result
            status="403"
            title="403"
            style={{ height: "100vh" }}
            subTitle="Xin lỗi, bạn không phải quản trị viên nên bạn không truy cập được trang này"
            extra={
              <ButtonComponent
                textButton={"Trở về trang chủ"}
                onClick={() => navigate("/")}
              ></ButtonComponent>
            }
          />
        </div>
      )}
    </>
  );
};

export default AdminPage;
