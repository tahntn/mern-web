import { Badge, Col, Divider, Drawer, Dropdown, Row, Space } from "antd";
import TopHeaderComponent from "../TopHeaderComponent/TopHeaderComponent";
import logo2 from "../../assets/images/logo (8).png";
import logo from "../../assets/images/logo (5).png";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  resetUser,
  setIsLoading,
  updateUser1,
} from "../../features/auth/authSlice";
import {
  MenuOutlined,
} from "@ant-design/icons";
import * as UserService from "../../service/UserService";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { SlBasket } from "react-icons/sl";
import { RiShoppingCart2Line } from "react-icons/ri";
import { MdPersonOutline, MdShoppingCart } from "react-icons/md";
import * as ProductService from "../../service/ProductService.js";

import { convertPrice } from "../../utils";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { DeleteOutlined } from "@ant-design/icons";
import { searchProduct } from "../../features/product/productSlice";
const DefaultHeaderComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [isAb, setIsAb] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isBgTrans, setIsBgTrans] = useState(false);
  const [isShowTopHeader, setIsShowTopHeader] = useState(false);
  const [isHoverSignup, setIsHoverSignup] = useState(false);
  const [isHoverLogin, setIsHoverLogin] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      if (prevScrollPos < currentScrollPos) {
        setVisible(false);
      }
      if (prevScrollPos > currentScrollPos) {
        setVisible(true);
        setIsAb(true);
      }
      if (currentScrollPos < 8) {
        setVisible(true);
        setIsAb(false);
      }
      if (currentScrollPos === 0) {
      }

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, visible, setVisible]);

  const handleMenuClick = (e) => {
    if (e.key === "1") {
      navigate("/profile")
    }
    else if (e.key === "2") {
      navigate("/my-order",{
        state: {
          id: user?.id,
          access_token: user?.access_token,
        },
      })
    }
    else if (e.key === "3") {
      handleClickLogout();
    }
  };
  const showDrawerMenu = () => {
    setOpenMenu(true);
  };
  const onCloseMenu = () => {
    setOpenMenu(false);
  };

  const handleClickLogout = async () => {
    setLoading(true);
    await UserService.logoutUser();
    dispatch(resetUser());
    setLoading(false);
  };
  const handleMouseEnter = () => {
    setIsHoverSignup(true);
  };

  const handleMouseEnterLogin = () => {
    setIsHoverLogin(true);
  };

  const handleMouseLeave = () => {
    setIsHoverSignup(false);
  };

  const handleMouseLeaveLogin = () => {
    setIsHoverLogin(false);
  };

  const activeStyle1 = {
    color: "white",
  };
  const styleSignUp = {
    // backgroundColor: isHover ? 'lightblue' : 'rgb(0, 191, 255)',
    // color: isHover ? 'red' : 'green',
    borderColor: isHoverSignup ? "white" : "#868e96",
  };

  const styleLogin = {
    border: "1px solid rgb(11, 116, 229)",
    color: "white",
    background: "rgb(11, 116, 229)",
  };

  const styleTextSignUp = {
    color: isHoverSignup ? "white" : "#868e96",
  };
  const styleTextLogin = {
    color: isHoverLogin ? "white" : "#ffffffba",
  };
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
      name: "Liên hệ",
      path: "/contact",
    },
  ];
  const items = [
    {
      label: "Thông tin tài khoản",
      key: "1",
    },
    {
      label: "Đơn hàng của tôi",
      key: "2",
    },
    {
      label: "Đăng xuất",
      key: "3",
    },
  ];
  const newList = [
    {
      name: "Trang chủ",
      path: "/",
    
    },
    {
      name: "Sản phẩm",
      path: "/category",
    },
    {
      name: "Liên hệ",
      path: "/contact",
    },
    {
      name: "Giỏ hàng",
      path: "/order",
    },
    {
      name: "Đơn hàng của tôi",
      path: "/my-order",
      isState: true
    },
    // {
    //   name: "Đăng xuất",
    //   path: "/my-order",
    // },
  ];

  const [openOrder, setOpenOrder] = useState(false);
  const [wishList, setWishList] = useState([]);
  useEffect(() => {
    setLoading(true);
    setWishList(user?.wishList);
    setLoading(false);
  }, [ user?.wishList]);
  const onCloseOrder = () => {
    setOpenOrder(false);
  };
  const showDrawerOrder = () => {
    setOpenOrder(true);
  };
  const mutationRemoveProduct = useMutationHooks((data) =>
  ProductService.removeProductToWishList(data)
);
  const {
    isSuccess: isSuccessRemoveProduct,
    isLoading: isLoadingRemoveProduct,
  } = mutationRemoveProduct;
  const handleDeleteOrder = (idProduct) => {

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


  const handleSearhChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearhClick = () => {
    // e.preventDefault()
    dispatch(searchProduct(search));
    setSearch("");
    navigate("/category");
  };
  return (
    <>
      <div className={isAb && "testheader1"} style={{ background: "#000" }}>
        <div className="container py-5">
          <Row gutter={[16, 24]} align="middle" className="max-w-full">
          
          <Col span={2}  className="xl:hidden" onClick={showDrawerMenu}  >
              <MenuOutlined
              className="xs:text-lg sm:text-3xl"
                style={{  color: "#fff", cursor: "pointer" }}
              />
            </Col>
            <Col xl={2} sm={4} xs={6}>
              <div className="w-full xs:w-6/12">
                <img src={logo} alt="logo" className="w-full" />
              </div>
            </Col>
            <Col span={8} className="sm:hidden xs:hidden xl:block ">
              <Row gutter={[16, 24]} align="middle" className="">
                {list.map((item) => (
                  <Col key={item.name} style={{ color: "#868e96" }}>
                    <NavLink
                      to={item.path}
                      end
                      className="text-xl font-medium hover:text-white"
                      style={({ isActive }) =>
                        isActive ? activeStyle1 : undefined
                      }
                    >
                      {item.name}
                    </NavLink>
                  </Col>
                ))}
              </Row>
            </Col>
            <Col className="xl:hidden" lg={2} md={0} sm={0} xs={0}></Col>
            <Col xl={6} lg={8} md={6} sm={0} xs={0}>
              <div
                className="flex items-center"
                style={{ borderBottom: "1px solid white" }}
              >
                <input
                  placeholder="Tìm kiếm ..."
                  className="text-lg relative text-white placeholder-white"
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    //   borderBottom: "1px solid #ccc",
                  }}
                  value={search}
                  onChange={handleSearhChange}
                />
                <AiOutlineSearch
                  className=" text-2xl absolute right-3 cursor-pointer"
                  style={{ color: "white" }}
                  onClick={handleSearhClick}
                />
              </div>
            </Col>
            <Col xl={8} lg={8} md={12} sm={18} xs={16}>
              <LoadingComponent isLoading={loading}>
                {user?.access_token ? (
                  <Row
                    gutter={[16, 24]}
                    align="middle"
                    className="flex-row-reverse items-center"
                  >
                    <Col className="cursor-pointer sm:hidden xs:hidden md:block">
                      {/* <div className="flex items-center"> */}
                      <Dropdown menu={{ items, onClick: handleMenuClick }}>
                        <div className="flex items-center">
                          <MdPersonOutline
                            style={{ fontSize: "30px", color: "white" }}
                          />
                          <span
                            className="text-xl font-medium"
                            style={{ color: "white" }}
                          >
                            {user?.name}
                          </span>
                        </div>
                      </Dropdown>
                    </Col>
                    <Col onClick={showDrawerOrder} 
                     className="cursor-pointer">
                      <Badge count={wishList.length} size="small">
                        <RiShoppingCart2Line
                          style={{ color: "white" }}
                          className="xs:text-lg sm:text-3xl "
                        />
                      </Badge>
                    </Col>
                  </Row>
                ) : (
                  <Space className="flex flex-row-reverse">
                    <ButtonComponent
                      textButton="Đăng nhập"
                      onMouseEnter={handleMouseEnterLogin}
                      onMouseLeave={handleMouseLeaveLogin}
                      styleButton={styleLogin}
                      styleTextButton={styleTextLogin}
                      onClick={
                        () => navigate("/login", { state: location?.pathname })
                        // () => setOpen(true)
                      }
                    />
                    <ButtonComponent
                      textButton="Đăng ký"
                      styleButton={styleSignUp}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      block
                      styleTextButton={styleTextSignUp}

                      onClick={() =>
                        navigate("/signup", { state: location?.pathname })
                        // setOpenSignup(true)
                      }
                    />
                  </Space>
                )}
              </LoadingComponent>
            </Col>
          </Row>
        </div>
      </div>
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
                          onClick={() => handleDeleteOrder(orderItem.product)}
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
              user?.access_token ? (
                <div
                  className="flex items-center cursor-pointer "
                  // onClick={onClickAvatar}
                >
                  <div className="w-7 h-7" >
                    <img
                      src={user?.avatar}
                      alt="avatar"
                      style={{
                        borderRadius: "50px",
                        border: "1px black solid",
                        padding: "1px",
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="ml-5">{user?.name}</span>
                </div>
              ) : (
                <>
                  <div
                    style={{ height: "80%", cursor: "pointer" }}
                    // onClick={onClickLogo}
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
            width={300}
            className="bg-black xs:w-64"
            placement="left"
            onClose={onCloseMenu}
            open={openMenu}
          >
            <>
              {/* <div>
                <SeacrhComponent textColor={true} />
              </div> */}
              <div className="flex flex-col app-list-menu">
                {newList.map((item) => (
                  <NavLink
                    to={item.path}
                    state={item?.isState && {
                      id: user?.id,
                      access_token: user?.access_token,
                    }}
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
                {user?.access_token && (<>
                  <NavLink
                  
                    className="p-6 border-solid border-b border-current"
                    onClick={async () => {
                    
                      await UserService.logoutUser();
                      dispatch(resetUser());
                      setOpenMenu(false)
                    }}
                  >
                    <span>Đăng xuất</span>
                  </NavLink>
                </>)}
               
              </div>
            </>
          </Drawer>
    </>
  );
};
export default DefaultHeaderComponent;
