import {
  Checkbox,
  Col,
  Divider,
  Form,
  InputNumber,
  Modal,
  Row,
  Select,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../component/ButtonComponent/ButtonComponent";
import LoadingComponent from "../../component/LoadingComponent/LoadingComponent";
import {
  decreaseAmount,
  increaseAmount,
  removeAllOrderProduct,
  removeOrderProduct,
  selectedOrder,
} from "../../features/order/orderSlice";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import * as UserService from "../../service/UserService";
import { updateUser1 } from "../../features/auth/authSlice";
import {
  error as MessError,
  warning as MessWarning,
} from "../../component/MessageComponent/MessageComponent";
import InputComponent from "../../component/InputComponent/InputComponent";
import axios from "axios";

import * as ProductService from "../../service/ProductService";
import StepComponent from "../../component/StepComponent/StepComponent";
import { convertPrice } from "../../utils";
import BreadcrumbComponent from "../../component/BreadcrumbComponent/BreadcrumbComponent";
import { ExclamationCircleFilled } from "@ant-design/icons";
import ServiceComponent from "../../component/ServiceComponent/ServiceComponent";

const { confirm } = Modal;
const OrderPage = () => {
 
  const user = useSelector((state) => state.auth);
 

  const [listChecked, setListChecked] = useState([]);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [orderItemsSlected, setOrderItemsSlected] = useState([]);
  const [indexCity, setIndexCity] = useState(1);
  const [indexDistrict, setIndexDistrict] = useState(1);
  const [wishList, setWishList] = useState([]);

  useEffect(() => {
    setWishList(user?.wishList);
  }, [user?.wishList]);

  const mutationAddCart = useMutationHooks((data) =>
    ProductService.addToWishList(data)
  );
  const mutationRemoveProduct = useMutationHooks((data) =>
    ProductService.removeProductToWishList(data)
  );
  const mutationRemoveAllProduct = useMutationHooks((data) =>
    ProductService.removeAllProductWishList(data)
  );

  const { isSuccess: isSuccessAddCart, isLoading: isLoadingAddCart } =
    mutationAddCart;
  const {
    isSuccess: isSuccessRemoveProduct,
    isLoading: isLoadingRemoveProduct,
  } = mutationRemoveProduct;
  const {
    isSuccess: isSuccessRemoveAllProduct,
    isLoading: isLoadingRemoveAllProduct,
  } = mutationRemoveAllProduct;

  useEffect(() => {
    if (isSuccessAddCart || isSuccessRemoveAllProduct) {
      handleGetDetailsUser(user?.id, user?.access_token);
    } else if (isSuccessRemoveProduct) {
      handleGetDetailsUser(user?.id, user?.access_token);
    }
  }, [isSuccessAddCart, isSuccessRemoveProduct, isSuccessRemoveAllProduct]);

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser1({ ...res?.data, access_token: token }));
  };

  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    city: "",
    district: "",
    ward: "",
    street: "",
  });
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter(
        (item) => item !== e.target.value
      );
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };

  const handleChangeCount = (type, idProduct) => {
    if (type === "increase") {
      mutationAddCart.mutate({
        amount: 1,
        prodId: idProduct,
        access_token: user?.access_token,
      });
    } else {
      const pro = wishList.find((item) => item.product === idProduct);
      if (pro.amount === 1) {
        mutationRemoveProduct.mutate({
          prodId: idProduct,
          access_token: user?.access_token,
        });
      } else {
        mutationAddCart.mutate({
          amount: -1,
          prodId: idProduct,
          access_token: user?.access_token,
        });
      }
    }
  };

  const handleDeleteOrder = (idProduct) => {
    mutationRemoveProduct.mutate({
      prodId: idProduct,
      access_token: user?.access_token,
    });
    // dispatch(removeOrderProduct({ idProduct }));
  };

  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = [];
      wishList?.forEach((item) => {
        newListChecked.push(item?.product);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };

  // console.log("-----listChecked", listChecked);

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [listChecked]);

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        name: user?.name,
        phone: user?.phone,
        city: user?.city,
        district: user?.district,
        ward: user?.ward,
        street: user?.street,
        indexCity: user?.indexCity,
        indexDistrict: user?.indexDistrict,
      });
    }
  }, [isOpenModalUpdateInfo]);

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  };
  useEffect(() => {
    let newListChecked = wishList.filter((item) =>
      listChecked.includes(item.product)
    );
    setOrderItemsSlected(newListChecked);
  }, [listChecked, wishList]);

  const priceMemo = useMemo(() => {
    const result = orderItemsSlected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [orderItemsSlected]);

  const priceDiscountMemo = useMemo(() => {
    const result = orderItemsSlected?.reduce((total, cur) => {
      return total + cur.discount * cur.amount;
    }, 0);
    if (Number(result)) {
      return result;
    }
    return 0;
  }, [orderItemsSlected]);

  const diliveryPriceMemo = useMemo(() => {
    if (priceMemo >= 200000 && priceMemo < 500000) {
      return 10000;
    } else if (priceMemo >= 500000 || orderItemsSlected?.length === 0) {
      return 0;
    } else {
      return 20000;
    }
  }, [priceMemo]);

  const totalPriceMemo = useMemo(() => {
    return (
      Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
    );
  }, [priceMemo, priceDiscountMemo, diliveryPriceMemo]);

  const totalPriceDolamemo = useMemo(() => {
    let price = Number(totalPriceMemo / 30000);
    let result = Math.round(price * 100) / 100;
    return result;
  }, [totalPriceMemo]);

  const showConfirm = () => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa hết tất cả sản phẩm trong giỏ hàng?",
      icon: <ExclamationCircleFilled />,
      cancelText: "Không",
      okText: "Xác nhận",
      onOk() {
        mutationRemoveAllProduct.mutate({
          access_token: user?.access_token,
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleRemoveAllOrder = () => {
    if (wishList.length === 0) {
      MessWarning("Vui lòng thêm sản phẩm vào giỏ hàng");
    } else {
      showConfirm();
    }
  };

  const handleAddCard = () => {
    if (!orderItemsSlected?.length) {
      MessError("Vui lòng chọn sản phẩm");
    } else if (
      !user?.phone ||
      !user.street ||
      !user.name ||
      !user.city ||
      !user.district ||
      !user.ward
    ) {
      setIsOpenModalUpdateInfo(true);
    } else {
      // dispatch()

      navigate("/payment", { state: orderItemsSlected });
    }
  };

  const mutationUpdate = useMutationHooks(
    ({
      id,
      name,
      phone,
      city,
      street,
      district,
      ward,
      indexCity,
      indexDistrict,
      access_token,
    }) =>
      UserService.updateUser(
        id,
        {
          name,
          phone,
          address_city: city,
          address_district: district,
          address_wards: ward,
          address_street: street,
          indexCity,
          indexDistrict,
        },
        access_token
      )
  );

  const { isLoading, data } = mutationUpdate;

  const handleCancleUpdate = () => {
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
    });
    form.resetFields();
    setIsOpenModalUpdateInfo(false);
  };
  const handleUpdateInforUser = () => {
    const { name, city, street, district, ward, phone } = stateUserDetails;
    const { ...newUser } = user;

    // console.log( { id: user?.id, access_token: user?.access_token,indexCity,indexDistrict ,...stateUserDetails });
    if (name && street && district && ward && city && phone) {
      mutationUpdate.mutate(
        {
          id: user?.id,
          access_token: user?.access_token,
          indexCity,
          indexDistrict,
          ...stateUserDetails,
        },
        {
          onSuccess: () => {
            dispatch(
              updateUser1({
                ...newUser,
                name,
                address_street: street,
                address_district: district,
                address_wards: ward,
                address_city: city,
                phone,
                _id: user?.id,
              })
            );
            setIsOpenModalUpdateInfo(false);
          },
        }
      );
    } else {
      MessError("Vui long nhap day du thong tin");
    }
  };

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };
  const itemsDelivery = [
    {
      title: "20.000 VND",
      description: "Dưới 200.000 VND",
    },
    {
      title: "10.000 VND",
      description: "Từ 200.000 VND đến dưới 500.000 VND",
    },
    {
      title: "0 VND",
      description: "Trên 500.000 VND",
    },
  ];

  const [dataCity, setDataCity] = useState([]);
  useEffect(() => {
    const getCity = async () => {
      const req = await axios.get("https://provinces.open-api.vn/api/?depth=3");
      setDataCity(req.data);
    };

    getCity();
  }, []);

  const handleChangeCity = (value) => {
    setIndexCity(value);
    setStateUserDetails({
      ...stateUserDetails,
      city: dataCity[value]?.name,
    });
  };
  const handleChangeDistricts = (value) => {
    setIndexDistrict(value);
    setStateUserDetails({
      ...stateUserDetails,
      district: dataCity[indexCity]?.districts[value].name,
    });
   
  };
  const handleChangeWard = (value) => {
    setStateUserDetails({
      ...stateUserDetails,
      ward: value,
    });
  };
  return (
    <div style={{ background: "#f5f5fa" }} className="spacingPage">
      <BreadcrumbComponent title={"Giỏ hàng"} />
      <div>
        <Row style={{ display: "flex", justifyContent: "center" }}>
          <Col span={16} className="pr-3">
            <div>
              <StepComponent
                items={itemsDelivery}
                current={
                  diliveryPriceMemo === 10000
                    ? 2
                    : diliveryPriceMemo === 20000
                    ? 1
                    : orderItemsSlected.length === 0
                    ? 0
                    : 3
                }
              />
            </div>
            <div>
              <span style={{ display: "inline-block", width: "390px" }}>
                <Checkbox
                  onChange={handleOnchangeCheckAll}
                  checked={listChecked?.length === wishList?.length}
                ></Checkbox>
                <span> Tất cả ({wishList?.length} sản phẩm)</span>
              </span>
              <Row>
                <Col span={14} className="flex justify-center">
                  <span>Đơn giá</span>
                </Col>
                <Col span={4} className="flex justify-center">
                  <span>Số lượng</span>
                </Col>
                <Col span={4} className="flex justify-center">
                  <span>Thành tiền</span>
                </Col>
                <Col span={2}>
                  <DeleteOutlined
                    style={{ cursor: "pointer" }}
                    onClick={handleRemoveAllOrder}
                  />
                </Col>
              </Row>
              <Divider />
              {/* <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                
              </div> */}
            </div>
            <div>
              <LoadingComponent isLoading={isLoadingRemoveAllProduct}>
                <LoadingComponent isLoading={isLoadingRemoveProduct}>
                  <LoadingComponent isLoading={isLoadingAddCart}>
                    {wishList?.map((order, index) => {
                      return (
                        <>
                          <Row key={index}>
                            <Col span={14}>
                              <Row className="flex">
                                <Col span={2}>
                                  <Checkbox
                                    onChange={onChange}
                                    value={order?.product}
                                    checked={listChecked.includes(
                                      order?.product
                                    )}
                                  ></Checkbox>
                                </Col>
                                <Col span={6}>
                                  <Row>
                                    <img
                                      src={order?.image}
                                      style={{
                                        width: "80%",
                                        // height: "60px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  </Row>
                                  <Row>
                                    <h5 className="font-normal">
                                      {convertPrice(order?.price)}
                                    </h5>
                                  </Row>
                                </Col>
                                <Col span={16}>
                                  <Row
                                    style={
                                      {
                                        // width: 260,
                                        // overflow: "hidden",
                                        // textOverflow: "ellipsis",
                                        // whiteSpace: "nowrap",
                                      }
                                    }
                                  >
                                    <h5 className="font-medium">
                                      {order?.name}
                                    </h5>
                                  </Row>
                                </Col>
                              </Row>
                            </Col>
                            <Col span={4}>
                              <div className="flex justify-around items-center">
                                <button
                                  style={{
                                    border: "none",
                                    background: "transparent",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleChangeCount(
                                      "decrease",
                                      order?.product
                                    )
                                  }
                                >
                                  <MinusOutlined
                                    style={{ color: "#000", fontSize: "10px" }}
                                  />
                                </button>
                                <InputNumber
                                  defaultValue={order?.amount}
                                  value={order?.amount}
                                  size="middle"
                                />
                                <button
                                  style={{
                                    border: "none",
                                    background: "transparent",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleChangeCount(
                                      "increase",
                                      order?.product
                                    )
                                  }
                                >
                                  <PlusOutlined
                                    style={{ color: "#000", fontSize: "10px" }}
                                  />
                                </button>
                              </div>
                            </Col>
                            <Col span={4}>
                              <div className="flex justify-around items-center pt-1">
                                <span
                                  style={{
                                    color: "rgb(255, 66, 78)",
                                    fontSize: "15px",
                                    fontWeight: 500,
                                  }}
                                >
                                  {convertPrice(order?.price * order?.amount)}
                                </span>
                              </div>
                            </Col>
                            <Col span={2} className="pt-1">
                              <DeleteOutlined
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  handleDeleteOrder(order?.product)
                                }
                              />
                            </Col>
                          </Row>
                          <Divider />
                        </>
                      );
                    })}
                  </LoadingComponent>
                </LoadingComponent>
              </LoadingComponent>
            </div>
          </Col>
          <Col span={8} className="pl-3">
            <div style={{ width: "100%" }}>
              <div>
                <div>
                  <span
                    onClick={handleChangeAddress}
                    style={{ color: "blue", cursor: "pointer" }}
                  >
                    Thay đổi
                  </span>
                  <br />
                  <span>Tên người nhận: </span>
                  <span style={{ fontWeight: "bold" }}>{user?.name}</span>
                  <br />
                  <span>Số điện thoại: </span>
                  {user?.phone ? (
                    <span style={{ fontWeight: "bold" }}>0{user?.phone}</span>
                  ) : (
                    <span style={{ fontWeight: "bold" }}>
                      Chưa có số điện thoại
                    </span>
                  )}
                  <br />
                  <span>Địa chỉ: </span>
                  {/* <span>                  {user?.name}</span> */}

                  {user?.street && user?.ward && user.district && (
                    <span style={{ fontWeight: "bold" }}>
                      {`${user?.street},${user?.ward}, ${user.district} ,${user?.city}`}{" "}
                    </span>
                  )}
                </div>
              </div>
              <Divider />
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Tạm tính</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(priceMemo)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Giảm giá</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >{`${priceDiscountMemo} %`}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Phí giao hàng</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {diliveryPriceMemo}
                  </span>
                </div>
              </div>
              <div>
                <span>Tổng tiền</span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      color: "rgb(254, 56, 52)",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(totalPriceMemo)} ( {totalPriceDolamemo} $ )
                  </span>
                  <span style={{ color: "#000", fontSize: "11px" }}>
                    (Đã bao gồm VAT nếu có)
                  </span>
                </span>
              </div>
            </div>
            <ButtonComponent
              onClick={() => handleAddCard()}
              size={40}
              styleButton={{
                background: "rgb(255, 57, 69)",
                height: "48px",
                width: "320px",
                border: "none",
                borderRadius: "4px",
              }}
              textButton={"Mua hàng"}
              styleTextButton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
          </Col>
        </Row>
      </div>
      
        <ServiceComponent />
    
      <Modal
        title="Cập nhật thông tin giao hàng"
        open={isOpenModalUpdateInfo}
        onCancel={handleCancleUpdate}
        onOk={handleUpdateInforUser}
      >
        <LoadingComponent isLoading={isLoading}>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            // onFinish={onUpdateUser}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Tên"
              name="name"
              // rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateUserDetails["name"]}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              // rules={[{ required: true, message: "Please input your  phone!" }]}
            >
              <InputComponent
                value={stateUserDetails.phone}
                onChange={handleOnchangeDetails}
                name="phone"
              />
            </Form.Item>
            <>
              {/* //city */}
              <div className="flex items-center mb-5">
                <label htmlFor="city" style={{
                  width: "117px"
                }} className="flex flex-row-reverse pr-1.5">
                  Thành phố : {"  "}
                </label>

                <Select
                  name="city"
                  onChange={handleChangeCity}
                  style={{
                    width: "76%",
                  }}
                >
                  {dataCity?.map((item, index) => (
                    <Select.Option key={item.code} value={index}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              {/* District */}

              <div className="flex items-center mb-5">
                <label htmlFor="districts" style={{
                  width: "117px"
                }} className="flex flex-row-reverse pr-1.5">
                  Huyện/Quận : {"  "}
                </label>
                <Select
                  name="districts"
                  onChange={handleChangeDistricts}
                  style={{
                    width: "76%",
                  }}
                >
                  {dataCity[indexCity]?.districts?.map((item, index) => (
                    <Select.Option key={item.code} value={index}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              {/* ward */}
              <div className="flex items-center mb-5">
                <label htmlFor="wards" style={{
                  width: "117px"
                }} className="flex flex-row-reverse pr-1.5">
                  Phường/Xã : {"  "}
                </label>

                <Select
                  name="wards"
                  onChange={handleChangeWard}
                  style={{
                    width: "76%",
                  }}
                >
                  {dataCity[indexCity]?.districts[indexDistrict]?.wards.map(
                    (item) => (
                      <Select.Option key={item.code} value={item.name}>
                        {item?.name}
                      </Select.Option>
                    )
                  )}
                </Select>
              </div>
              {/* <div className="flex items-center mb-5"> */}
                <Form.Item
                  label="Street"
                  name="street"
                
                >
                  <InputComponent
                    value={stateUserDetails.street}
                    onChange={handleOnchangeDetails}
                    name="street"
                  />
                </Form.Item>
              {/* </div> */}
            </>
          </Form>
        </LoadingComponent>
      </Modal>
    </div>
  );
};

export default OrderPage;
