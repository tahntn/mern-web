import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Drawer, Input, Popover, Row, Space } from "antd";
// import InputComponent from "../InputComponent/InputComponent";
import SeacrhComponent from "../SearchComponent/SearchComponent";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo (5).png";
import logo2 from "../../assets/images/logo (8).png";
import "./HeaderComponent.scss";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  UserOutlined,
  ShoppingCartOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { logout, setIsLoading } from "../../features/auth/authSlice";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { userLogout } from "../../features/auth/authActions";
import { success as MessSuccess } from "../MessageComponent/MessageComponent";
import { setSearchProduct } from "../../features/product/productSlice";
import { searchProductByName } from "../../features/product/productAction";

const { Search } = Input;

const HeaderComponet = () => {
  const dispatch = useDispatch();
  const [openOrder, setOpenOrder] = useState(false);
  const [search, setSearch] = useState("")
  const [openMenu, setOpenMenu] = useState(false);
  const showDrawerOrder = () => {
    setOpenOrder(true);
  };
  const onCloseOrder = () => {
    setOpenOrder(false);
  };
  const showDrawerMenu = () => {
    setOpenMenu(true);
  };
  const onCloseMenu = () => {
    setOpenMenu(false);
  };
  const onClickAvatar = () => {
    navigate('/profile')
    setOpenMenu(false);
  }
  const onClickLogo = () => {
    setOpenMenu(false);
    navigate("/")
  }

  const { userInfo, isLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const activeStyle = {
    borderBottom: "2px solid",
  };
  const handleClick = () => {
    dispatch(userLogout());
    MessSuccess("Đã đăng xuất");
    navigate("/");
  };

  const handleSearhChange = (e) => {
    setSearch(e.target.value);
  }

  const handleSearhClick = () => {
    if(search === "") {

    } else {
      dispatch(searchProductByName(search))
      navigate("/category")
      dispatch(setSearch(""))

    }
  }

  const content = (
    <div className="flex flex-col">
      <ButtonComponent
        textButton={"Proflie"}
        onClick={() => {
          navigate("/profile");
        }}
      />
      <ButtonComponent textButton={"Logout"} onClick={handleClick} />
      {
        userInfo?.role === "true" ? (
          <ButtonComponent textButton={"Trang Admin"} onClick={() => navigate("/system/admin")} />
        ) : undefined
      }
    </div>
  );

  const list = [
    {
      name: "Trang chủ",
      path: "/",
    },
    {
      name: "Sản phẩm",
      path: "/category",
    },
    {
      name: "Về chúng tôi",
      path: "/about",
    },
    {
      name: "Liên hệ",
      path: "/contact",
    },
  ];
  return (
    <>
      <Row className="app lg:px-20 sm:px-5 sm:pl-10 xs:px-3  text-white flex items-center bg-black h-24 ">
        <Col span={2} xs className=" xl:hidden" onClick={showDrawerMenu}>
          <MenuOutlined
            style={{ fontSize: "30px", color: "#fff", cursor: "pointer" }}
          />
        </Col>
        <Col
          xl={4}
          md={9}
          sm={9}
          xs={9}
          className="app-logo h-full flex items-center"
        >
          <div style={{ height: "80%" }} className="sm:ml-10 xs:ml-5 md:ml-0 cursor-pointer  " onClick={onClickLogo}>
            <img
              src={logo}
              alt="logo"
              style={{ width: "80%", height: "100%", objectFit: "contain" }}
            />
          </div>
        </Col>
        <Col xl={11} className="sm:hidden xl:block app-list xs:hidden">
          {list.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
            >
              {item.name}
            </NavLink>
          ))}
        </Col>
        <Col xl={{ span: 9, offset: 0 }} md={13} sm={13} xs={13} className="">
          <Row justify="end">
            <Col span={10} className="sm:hidden md:block xs:hidden">
              <SeacrhComponent
                textColor={false}
                styleDiv={{maxWidth:'190px'}}
                onChange={handleSearhChange}
                onClick={handleSearhClick}
                // value={search}
              />
            </Col>
            <Col
              span={11}
              className="app-search flex items-center justify-end "
            >
              {isLoading ? (
                <div>
                  <LoadingComponent></LoadingComponent>
                </div>
              ) : userInfo ? (
                <Row className="flex items-center justify-end w-full ">
                  <Col lg={4} sm={10} xs={10} offset={0}>
                    <div
                      onClick={showDrawerOrder}
                      style={{ cursor: "pointer" }}
                    >
                      <Badge count={"4"} size="small">
                        <ShoppingCartOutlined
                          style={{ fontSize: "30px", color: "#fff" }}
                        />
                      </Badge>
                    </div>
                  </Col>
                  <Col
                    xs={{ span: 10, offset: 3 }}
                    lg={{ span: 16, offset: 2 }}
                    sm={{ span: 10, offset: 1 }}
                  >
                    <Popover
                      content={content}
                      placement="bottomLeft"
                      trigger="click"
                    >
                      <Row className="flex items-center lg:justify-around sm:justify-start   cursor-pointer">
                        <Col className="" lg={10} md={4} xs={4}>
                          <div style={{ width: "45px", height: "45px" }}>
                            {userInfo?.avatar ? (
                              <img
                                src={userInfo?.avatar}
                                alt="Avatar"
                                className="w-full h-full rounded-full"
                              />
                            ) : (
                              <div
                                style={{
                                  padding: "8px 10px",
                                  border: "2px solid #fff",
                                  borderRadius: "50%",
                                }}
                              >
                                <UserOutlined
                                  style={{ fontSize: "20px", color: "#fff" }}
                                />
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col lg={14}>
                          <p
                            className="text-white sm:hidden xs:hidden lg:block"
                            style={{
                              maxWidth: "70px",
                              fontSize: "20px",
                              fontWght: "600",
                            }}
                          >
                            {userInfo?.name.split(" ")[0]}
                          </p>
                        </Col>
                      </Row>
                    </Popover>
                  </Col>
                </Row>
              ) : (
                <Space>
                  <ButtonComponent
                    textButton="Login"
                    styleButton={{
                      border: "1px solid rgb(11, 116, 229)",
                      color: "white",
                      background: "rgb(11, 116, 229)",
                    }}
                    onClick={() => navigate("/login")}
                  />
                  <ButtonComponent
                    textButton="Signup"
                    styleButton={{
                      color: "white",
                      "&:hover": {
                        background: "white",
                      },
                    }}
                    onClick={() => navigate("/signup")}
                  />
                </Space>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      <Drawer
        title="Giỏ hàng của bạn"
        placement="right"
        onClose={onCloseOrder}
        open={openOrder}
      >
        <div>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </div>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>

      <Drawer
        title={userInfo ?(<div className="flex items-center cursor-pointer " onClick={onClickAvatar}>
        <div style={{width: "60px"}}>
          <img 
            src={userInfo?.avatar}
            alt="avatar"
            style={{ width: "100%%", objectFit: "contain", borderRadius: "50px", border: "1px black solid", padding: "1px" }} 
          />
        </div>
        <span className="ml-5">{userInfo?.name}</span>
        </div>) : (<>
        <div style={{ height: "80%", cursor: "pointer" }}  onClick={onClickLogo}>
          <img src={logo2}
              alt="logo"
              style={{ width: "40%", height: "100%", objectFit: "contain" }} />
          </div>
        </>)}
        className="bg-black"
        placement="left"
        onClose={onCloseMenu}
        open={openMenu}
      
      >
        <>
        <div>
          <SeacrhComponent
            textColor={true}
          />
        </div>
       <div className="flex flex-col app-list-menu">
       {list.map((item) => (

            <NavLink
              to={item.path}
              key={item.name}
              end
              style={({ isActive }) => (isActive ? {fontWeight : '600', color: "red", borderColor: "black"} : undefined)}
              className="p-6 border-solid border-b border-current"
              onClick={()=> setOpenMenu(false)}
            >
             <span >
              {item.name}

             </span>

            </NavLink>
          ))}
     
       </div>
        </>
      </Drawer>
    </>
  );
};

export default HeaderComponet;
