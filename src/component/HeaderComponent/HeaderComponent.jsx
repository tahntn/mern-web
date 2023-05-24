import React, { useEffect, useState } from "react";
import {
  Affix,
  Badge,
  Button,
  Col,
  Drawer,
  Input,
  Modal,
  Popover,
  Row,
  Space,
} from "antd";
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
import {
  logout,
  resetUser,
  setIsLoading,
  updateUser1,
} from "../../features/auth/authSlice";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { userLogout } from "../../features/auth/authActions";
import { success as MessSuccess } from "../MessageComponent/MessageComponent";
import {
  searchProduct,
  setSearchProduct,
} from "../../features/product/productSlice";

import * as UserService from "../../service/UserService";
import { convertPrice } from "../../utils";
import { DeleteOutlined } from "@ant-design/icons";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as ProductService from "../../service/ProductService.js";
import ModalLoginComponent from "../ModalLoginComponent/ModalLoginComponent";
import ModalSignUpComponent from "../ModalSignUpComponent/ModalSignUpComponent";
import TopHeaderComponent from "../TopHeaderComponent/TopHeaderComponent";
const HeaderComponet = () => {
  const [open, setOpen] = useState(false);
  const handleOk = (e) => {
    setOpen(false);
  };
  const handleCancel = (e) => {
    setOpen(false);
  };
  const [openSignup, setOpenSignup] = useState(false);
  const handleOkSignup = (e) => {
    setOpenSignup(false);
  };
  const handleCancelSignup = (e) => {
    setOpenSignup(false);
  };

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [openOrder, setOpenOrder] = useState(false);
  const [search, setSearch] = useState("");
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
    navigate("/profile");
    setOpenMenu(false);
  };
  const onClickLogo = () => {
    setOpenMenu(false);
    navigate("/");
  };
  const [wishList, setWishList] = useState([]);
  const user = useSelector((state) => state.auth);
  const order = useSelector((state) => state.order);
  const { resetSearch } = useSelector((state) => state.product);
  useEffect(() => {
    setLoading(true);
    setWishList(user?.wishList);
    setLoading(false);
  }, [ user?.wishList]);

  // useEffect(()=> {
  //   setLoading(true);
  //   setWishList(user?.wishList)
  //   setLoading(false);
  // },[user?.wishList])

  const navigate = useNavigate();
  const activeStyle = {
    borderBottom: "2px solid",
  };

  const handleClick = async () => {
    setLoading(true);
    await UserService.logoutUser();
    dispatch(resetUser());
    setLoading(false);
  };

  const handleSearhChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearhClick = (e) => {
    // e.preventDefault()
    dispatch(searchProduct(search));
    setSearch("");
    navigate("/category");
  };

  const content = (
    <div className="flex flex-col">
      <ButtonComponent
        textButton={"Proflie"}
        onClick={() => {
          navigate("/profile");
        }}
      />
      <ButtonComponent
        textButton={"my order"}
        onClick={() => {
          navigate("/my-order", {
            state: {
              id: user?.id,
              access_token: user?.access_token,
            },
          });
        }}
      />
      <ButtonComponent textButton={"Logout"} onClick={handleClick} />
      {user?.role === "true" ? (
        <ButtonComponent
          textButton={"Trang Admin"}
          onClick={() => navigate("/system/admin")}
        />
      ) : undefined}
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

  const mutationRemoveProduct = useMutationHooks((data) =>
    ProductService.removeProductToWishList(data)
  );
  const {
    isSuccess: isSuccessRemoveProduct,
    isLoading: isLoadingRemoveProduct,
  } = mutationRemoveProduct;

  const handleDeleteOrder = (idProduct) => {
    // console.log(idProduct, user?.access_token );
    mutationRemoveProduct.mutate({
      prodId: idProduct,
      access_token: user?.access_token,
    });
  };

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser1({ ...res?.data, access_token: token }));
  };

  useEffect(() => {
    if (isSuccessRemoveProduct) {
      handleGetDetailsUser(user?.id, user?.access_token);
    }
  }, [isSuccessRemoveProduct]);

  return (
    <>
    
      <Affix offsetTop={0}>
        <div>
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
              <div
                style={{ height: "80%" }}
                className="sm:ml-10 xs:ml-5 md:ml-0 cursor-pointer  "
                onClick={onClickLogo}
              >
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
            <Col
              xl={{ span: 9, offset: 0 }}
              md={13}
              sm={13}
              xs={13}
              className=""
            >
              <Row justify="end">
                <Col span={10} className="sm:hidden md:block xs:hidden">
                  <SeacrhComponent
                    textColor={false}
                    styleDiv={{ maxWidth: "190px" }}
                    onChange={handleSearhChange}
                    onClick={handleSearhClick}
                    value={search}
                    // value={search}
                  />
                </Col>
                <Col
                  span={11}
                  className="app-search flex items-center justify-end "
                >
                  {loading ? (
                    <div>
                      <LoadingComponent isLoading={loading}></LoadingComponent>
                    </div>
                  ) : user?.access_token ? (
                    <Row className="flex items-center justify-end w-full ">
                      <Col lg={4} sm={10} xs={10} offset={0}>
                        <div
                          onClick={showDrawerOrder}
                          style={{ cursor: "pointer" }}
                        >
                          <Badge count={wishList?.length} size="small">
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
                                {user?.avatar ? (
                                  <img
                                    src={user?.avatar}
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
                                      style={{
                                        fontSize: "20px",
                                        color: "#fff",
                                      }}
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
                                {user?.name.split(" ")[0]}
                              </p>
                            </Col>
                          </Row>
                        </Popover>
                      </Col>
                    </Row>
                  ) : (
                    <Space>
                      <ButtonComponent
                        textButton="Đăng nhập"
                        styleButton={{
                          border: "1px solid rgb(11, 116, 229)",
                          color: "white",
                          background: "rgb(11, 116, 229)",
                        }}
                        styleTextButton={{ color: "white" }}
                        onClick={
                          // () => navigate("/login")
                          () => setOpen(true)
                        }
                      />
                      <ButtonComponent
                        textButton="Đăng ký"
                        styleButton={{
                          color: "white",
                          "&:hover": {
                            background: "white",
                          },
                        }}
                        styleTextButton={{ color: "white" }}
                        onClick={() =>
                          // navigate("/signup")
                          setOpenSignup(true)
                        }
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
            className="drawer-order"
          >
            <LoadingComponent isLoading={isLoadingRemoveProduct}>
              <div className="h-full">
                {wishList?.length > 0 && (
                  <span>Số lượng giỏ hàng: {wishList.length}</span>
                )}
                <div
                  className="scrollOrder"
                  style={{
                    height: "calc(100% - 70px )",
                    overflowY: "scroll",
                  }}
                >
                  {wishList?.length > 0 ? (
                    <div>
                      {wishList?.map((orderItem, index) => (
                        <Row
                          key={index}
                          className="flex items-center py-4"
                          style={{
                            borderBottom: "1px solid #ccc",
                          }}
                        >
                          <Col span={5} className="">
                            <img
                              src={orderItem?.image}
                              alt={orderItem?.name}
                              className=""
                            />
                          </Col>
                          <Col span={17} className="flex flex-col pl-3">
                            <h1 className="text-base font-medium">
                              {" "}
                              {orderItem?.name}{" "}
                            </h1>
                            <h2>
                              <span className="text-base">Số lượng: </span>{" "}
                              {orderItem?.amount}{" "}
                            </h2>
                            <h2 className="text-sm font-medium">
                              <span className="text-base">Giá: </span>{" "}
                              {convertPrice(orderItem.price)}
                            </h2>
                          </Col>
                          <Col>
                            <DeleteOutlined
                              style={{ color: "red", fontSize: "18px" }}
                              className="cursor-pointer"
                              onClick={() =>
                                handleDeleteOrder(orderItem.product)
                              }
                            />
                          </Col>
                        </Row>
                      ))}
                    </div>
                  ) : (
                    <h1>Không có sản phẩm trong giỏ hàng</h1>
                  )}
                </div>
                <div className="flex justify-center">
                  <ButtonComponent
                    className="w-10/12 mt-3"
                    textButton={`Giỏ hàng`}
                    onClick={() => {
                      setOpenOrder(false);
                      navigate("/order");
                    }}
                  />
                  {/* <ButtonComponent
            textButton={"Thanh toán"}
            onClick={() => {
              setOpenOrder(false);
              navigate("/order");
            }}
            /> */}
                </div>
              </div>
            </LoadingComponent>
          </Drawer>

          <Drawer
            title={
              user ? (
                <div
                  className="flex items-center cursor-pointer "
                  onClick={onClickAvatar}
                >
                  <div style={{ width: "60px" }}>
                    <img
                      src={user?.avatar}
                      alt="avatar"
                      style={{
                        width: "100%%",
                        objectFit: "contain",
                        borderRadius: "50px",
                        border: "1px black solid",
                        padding: "1px",
                      }}
                    />
                  </div>
                  <span className="ml-5">{user?.name}</span>
                </div>
              ) : (
                <>
                  <div
                    style={{ height: "80%", cursor: "pointer" }}
                    onClick={onClickLogo}
                  >
                    <img
                      src={logo2}
                      alt="logo"
                      style={{
                        width: "40%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                </>
              )
            }
            className="bg-black"
            placement="left"
            onClose={onCloseMenu}
            open={openMenu}
          >
            <>
              <div>
                <SeacrhComponent textColor={true} />
              </div>
              <div className="flex flex-col app-list-menu">
                {list.map((item) => (
                  <NavLink
                    to={item.path}
                    key={item.name}
                    end
                    style={({ isActive }) =>
                      isActive
                        ? {
                            fontWeight: "600",
                            color: "red",
                            borderColor: "black",
                          }
                        : undefined
                    }
                    className="p-6 border-solid border-b border-current"
                    onClick={() => setOpenMenu(false)}
                  >
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </div>
            </>
          </Drawer>

          <ModalLoginComponent
            open={open}
            handleOk={handleOk}
            handleCancel={handleCancel}
          />

          <ModalSignUpComponent
            open={openSignup}
            handleOk={handleOkSignup}
            handleCancel={handleCancelSignup}
            handleOpenLogin={() => setOpen(true)}
          />
        </div>
      </Affix>
    </>
  );
};

export default HeaderComponet;
