import { Col, Divider, Form, Modal, Radio, Row } from "antd";
import LoadingComponent from "../../component/LoadingComponent/LoadingComponent";
import * as UserService from "../../service/UserService";
import * as OrderService from "../../service/OrderService";
import * as PaymentService from "../../service/PaymentService";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import ButtonComponent from "../../component/ButtonComponent/ButtonComponent";
import InputComponent from "../../component/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { useLocation, useNavigate } from "react-router-dom";
import { convertPrice } from "../../utils";
// import { PayPalButton } from "react-paypal-button-v2";
import {
  error as MessError,
  success as MessSuccess,
} from "../../component/MessageComponent/MessageComponent";
import * as ProductService from "../../service/ProductService";
import { updateUser1 } from "../../features/auth/authSlice";
import BreadcrumbComponent from "../../component/BreadcrumbComponent/BreadcrumbComponent";
import ServiceComponent from "../../component/ServiceComponent/ServiceComponent";
// import * as UserService from "../../service/UserService";

const PaymentPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.auth);
  const { state } = useLocation();

  const [orderItemsSlected, setOrderItemsSlected] = useState([]);
  useEffect(() => {
    setOrderItemsSlected(state);
  }, []);

  const [delivery, setDelivery] = useState("fast");
  const [payment, setPayment] = useState("later_money");
  const navigate = useNavigate();
  const [sdkReady, setSdkReady] = useState(false);

  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    city: "",
    district: "",
    ward: "",
    street: "",
  });
  const [form] = Form.useForm();

  const dispatch = useDispatch();

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

  const priceMemo = useMemo(() => {
    const result = orderItemsSlected.reduce((total, cur) => {
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
    if (priceMemo > 200000) {
      return 10000;
    } else if (priceMemo === 0) {
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

  const onSuccessPaypal = (details, data) => {
    mutationAddOrder.mutate({
      token: user?.access_token,
      orderItems: orderItemsSlected,
      fullName: user?.name,

      phone: user?.phone,
      street: user?.street,
      district: user?.district,
      ward: user?.ward,
      city: user?.city,
      paymentMethod: payment,
      itemsPrice: priceMemo,
      shippingPrice: diliveryPriceMemo,
      totalPrice: totalPriceMemo,
      user: user?.id,
      isPaid: true,
      paidAt: details.update_time,
      // email: user?.email
    });
  };

  const handleAddOrder = () => {
    if (
      user?.access_token &&
      order?.orderItemsSlected &&
      user?.name &&
      user?.street &&
      user?.district &&
      user?.ward &&
      user?.phone &&
      user?.city &&
      priceMemo &&
      user?.id
    ) {
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: orderItemsSlected,
        fullName: user?.name,
        street: user?.street,
        district: user?.district,
        ward: user?.ward,
        phone: user?.phone,
        city: user?.city,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: diliveryPriceMemo,
        totalPrice: totalPriceMemo,
        user: user?.id,
      });
    } else {
      MessError("lỗi");
    }
  };

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, { ...rests }, token);
    return res;
  });

  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rests } = data;
    const res = OrderService.createOrder({ ...rests }, token);
    return res;
  });

  const mutationRemoveProduct = useMutationHooks((data) =>
    ProductService.removeProductToWishList(data)
  );

  const { isLoading, data } = mutationUpdate;
  const {
    data: dataAdd,
    isLoading: isLoadingAddOrder,
    isSuccess,
    isError,
  } = mutationAddOrder;

  const {
    isSuccess: isSuccessRemoveProduct,
    isLoading: isLoadingRemoveProduct,
  } = mutationRemoveProduct;

  useEffect(() => {
    if (isSuccess && dataAdd?.status === "SUCCESS") {
      const arrayOrdered = [];
      orderItemsSlected.forEach((element) => {
        arrayOrdered.push(element.product);
      });

      const promises = arrayOrdered.map((id) =>
        mutationRemoveProduct.mutateAsync({
          prodId: id,
          access_token: user?.access_token,
        })
      );

      Promise.all(promises)
        .then((result) => {
          const allSuccess = result.every(
            (result) =>{
              return result.status === "SUCCESS"
            } 
          );
          console.log(allSuccess);
          if (allSuccess) {
            handleGetDetailsUser(user?.id, user?.access_token);
          }
        })
        .catch((e) => {
          console.log(e);
        });

      MessSuccess("Đặt hàng thành công");
      navigate("/orderSuccess", {
        state: {
          delivery,
          payment,
          orders: orderItemsSlected,
          totalPriceMemo: totalPriceMemo,
        },
      });
    } else if (isError) {
      MessError("Lỗi");
    }
  }, [isSuccess, isError]);

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser1({ ...res?.data, access_token: token }));
  };

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
    const { name, address, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      //   mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
      //     onSuccess: () => {
      //       dispatch(updateUser({name, address,city, phone}))
      //       setIsOpenModalUpdateInfo(false)
      //     }
      //   })
    }
  };

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };
  const handleDilivery = (e) => {
    console.log(e.target.value);
    setDelivery(e.target.value);
    console.log(delivery);
  };

  const handlePayment = (e) => {
    setPayment(e.target.value);
  };

  // const addPaypalScript = async () => {
  //   const { data } = await PaymentService.getConfig();
  //   const script = document.createElement("script");
  //   script.type = "text/javascript";
  //   script.src = `https://www.paypal.com/sdk/js?client-id=${data}&disable-funding=card`;
  //   script.async = true;
  //   script.onload = () => {
  //     setSdkReady(true);
  //   };
  //   document.body.appendChild(script);
  // };

  // useEffect(() => {
  //   if (!window.paypal) {
  //     addPaypalScript();
  //   } else {
  //     setSdkReady(true);
  //   }
  // }, []);

  return (
    <>
      <div className="spacingPage">
        <LoadingComponent isLoading={isLoadingAddOrder}>
          <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
            <BreadcrumbComponent title={"Thanh toán"} />
            <Row>
              <Col span={14} className="pr-3">
                <div>
                  <h1 className="text-xl font-medium">
                    Sản phẩm muốn thanh toán ({orderItemsSlected?.length} sản
                    phẩm)
                  </h1>
                  <Divider />
                  <Row>
                    <Col span={3} className="flex justify-center">
                      <span>Ảnh</span>
                    </Col>
                    <Col span={9} className="flex justify-center">
                      <span>Đơn giá</span>
                    </Col>
                    <Col span={6} className="flex justify-center">
                      <span>Thành tiền</span>
                    </Col>
                    <Col span={6} className="flex justify-center">
                      <span>Số lượng</span>
                    </Col>
                  </Row>
                  <Divider />
                  <Row>
                    {orderItemsSlected.map((item, index) => (
                      <>
                        <Row key={index}>
                          <Col span={3} className="flex justify-center">
                            <img
                              src={item?.image}
                              style={{
                                width: "80%",
                                // height: "60px",
                                objectFit: "cover",
                              }}
                            />
                          </Col>
                          <Col span={9} className="flex justify-center">
                            <h5 className="font-medium">{item?.name}</h5>
                          </Col>
                          <Col span={6} className="flex justify-center">
                            <span
                              style={{
                                color: "rgb(255, 66, 78)",
                                fontSize: "15px",
                                fontWeight: 500,
                              }}
                            >
                              {convertPrice(item?.price * item?.amount)}
                            </span>
                          </Col>
                          <Col span={6} className="flex justify-center">
                            <h2>{item?.amount}</h2>
                          </Col>
                        </Row>
                        <Divider />
                      </>
                    ))}
                  </Row>
                  <div>
                    <lable className="text-2xl font-medium">
                      Chọn phương thức giao hàng:{" "}
                    </lable>
                    <br />
                    <Radio.Group onChange={handleDilivery} value={delivery}>
                      <Radio value="fast" className="text-xl font-normal">
                        <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                          FAST
                        </span>{" "}
                        Giao hàng nhanh
                      </Radio>
                      <br />
                      <Radio value="GHTK" className="text-xl font-normal">
                        <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                          GHTK
                        </span>{" "}
                        Giao hàng tiết kiệm
                      </Radio>
                    </Radio.Group>
                  </div>
                </div>
                <div>
                  <div>
                    <lable className="text-2xl font-medium">
                      Chọn phương thức thanh toán
                    </lable>
                    <br />
                    <Radio.Group onChange={handlePayment} value={payment}>
                      <Radio
                        value="later_money"
                        className="text-xl font-normal"
                      >
                        Thanh toán tiền mặt khi nhận hàng
                      </Radio>
                      <br />
                      <Radio value="paypal" className="text-xl font-normal">
                        {" "}
                        Thanh toán tiền bằng paypal
                      </Radio>
                    </Radio.Group>
                  </div>
                </div>
              </Col>
              <Col span={10} className="pl-3">
                <div style={{ width: "100%" }}>
                  <div>
                    <div>
                      {/* <span
                        onClick={handleChangeAddress}
                        style={{ color: "blue", cursor: "pointer" }}
                      >
                        Thay đổi
                      </span> */}
                      <br />
                      <span>Tên người nhận: </span>
                      <span style={{ fontWeight: "bold" }}>{user?.name}</span>
                      <br />
                      <span>Số điện thoại: </span>
                      {user?.phone ? (
                        <span style={{ fontWeight: "bold" }}>
                          {user?.phone}
                        </span>
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
                        {convertPrice(diliveryPriceMemo)}
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
                        {convertPrice(totalPriceMemo)} ( {totalPriceDolamemo} $
                        )
                      </span>
                      <span style={{ color: "#000", fontSize: "11px" }}>
                        (Đã bao gồm VAT nếu có)
                      </span>
                    </span>
                  </div>
                </div>
                {/* {payment === "paypal" && sdkReady ? (
                  <>
                    <div style={{ width: "320px" }}>
                      <PayPalButton
                        amount={Math.round(totalPriceMemo /  30000)}
                        // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                        onSuccess={onSuccessPaypal}
                        onError={() => {
                          alert("Erroe");
                        }}
                        fundingSourcePriority={["paypal"]}
                      />
                    </div>
                  </>
                ) : ( */}
                  <ButtonComponent
                    onClick={() => handleAddOrder()}
                    size={40}
                    styleButton={{
                      background: "rgb(255, 57, 69)",
                      height: "48px",
                      width: "320px",
                      border: "none",
                      borderRadius: "4px",
                    }}
                    textButton={"Đặt hàng"}
                    styleTextButton={{
                      color: "#fff",
                      fontSize: "15px",
                      fontWeight: "700",
                    }}
                  ></ButtonComponent>
                {/* )} */}
              </Col>
            </Row>
          </div>
          <Modal
            title="Cập nhật thông tin giao hàng"
            open={isOpenModalUpdateInfo}
            onCancel={handleCancleUpdate}
            onOk={handleUpdateInforUser}
          >
            <LoadingComponent isLoading={isLoading}>
              <Form
                name="basic"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                // onFinish={onUpdateUser}
                autoComplete="on"
                form={form}
              >
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please input your name!" },
                  ]}
                >
                  <InputComponent
                    value={stateUserDetails["name"]}
                    onChange={handleOnchangeDetails}
                    name="name"
                  />
                </Form.Item>
                <Form.Item
                  label="City"
                  name="city"
                  rules={[
                    { required: true, message: "Please input your city!" },
                  ]}
                >
                  <InputComponent
                    value={stateUserDetails["city"]}
                    onChange={handleOnchangeDetails}
                    name="city"
                  />
                </Form.Item>
                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[
                    { required: true, message: "Please input your  phone!" },
                  ]}
                >
                  <InputComponent
                    value={stateUserDetails.phone}
                    onChange={handleOnchangeDetails}
                    name="phone"
                  />
                </Form.Item>

                <Form.Item
                  label="Adress"
                  name="address"
                  rules={[
                    { required: true, message: "Please input your  address!" },
                  ]}
                >
                  <InputComponent
                    value={stateUserDetails.address}
                    onChange={handleOnchangeDetails}
                    name="address"
                  />
                </Form.Item>
              </Form>
            </LoadingComponent>
          </Modal>
        </LoadingComponent>
 
        <ServiceComponent />
   
      </div>
    </>
  );
};

export default PaymentPage;
