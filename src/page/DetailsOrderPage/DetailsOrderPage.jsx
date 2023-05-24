import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import LoadingComponent from "../../component/LoadingComponent/LoadingComponent";
import * as OrderService from "../../service/OrderService";
import { convertPrice } from "../../utils";
import BreadcrumbComponent from "../../component/BreadcrumbComponent/BreadcrumbComponent";
import { orderContant } from "../../constant.js";
import { Col, Divider, Row } from "antd";

import Moment from "react-moment";
import ServiceComponent from "../../component/ServiceComponent/ServiceComponent";

const DetailsOrderPage = () => {
  const params = useParams();
  const location = useLocation();
  const { state } = location;
  const { id } = params;

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, state?.token);
    return res.data;
  };

  const queryOrder = useQuery(
    { queryKey: ["orders-details"], queryFn: fetchDetailsOrder },
    {
      enabled: id,
    }
  );
  const { isLoading, data } = queryOrder;

  const priceMemo = useMemo(() => {
    const result = data?.orderItems?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [data]);

  return (
    <div className="spacingPage ">
      <LoadingComponent isLoading={isLoading}>
        <div>
          <BreadcrumbComponent
            title={"Đơn hàng của tôi"}
            titleSecond={`Chi tiết đơn hàng`}
          />

          <Row className="flex-col mb-8">
            {/* <h1 className="text-5xl font-bold mb-7">{`Đơn hàng #${id}`}</h1> */}

            <h1 className="text-lg font-normal">
              Đơn hàng #{id} được tạo ngày{" "}
              <Moment format="DD/MM/YYYY " withTitle>
                {data?.createdAt}
              </Moment>{" "}
              và đang trong tình trạng
              <span className="font-bold ">
                {data?.status === "Dispatched"
                  ? " Đang giao"
                  : data?.status === "Processing"
                  ? " Đang xử lý"
                  : data?.status === "Delivered"
                  ? " Đã giao"
                  : " Đã hủy"}
              </span>
            </h1>
           
          </Row>
          <div>
            <Row justify="center" align="top" gutter={[16, 24]}>
              <Col span={24}>
                <Row gutter={[16, 24]}>
                  <Col span={24}>
                    <div className="bg-white  shadow-2xl ">
                      <div className="p-8" style={{ background: "#f8f9fa" }}>
                        <Row>
                          <Col
                            span={1}
                            className="flex items-center justify-center"
                          >
                            <span className="text-xl text-black font-bold">
                              Stt
                            </span>
                          </Col>
                          <Col
                            span={3}
                            className="flex items-center justify-center"
                          >
                            <span className="text-xl text-black font-bold">
                              Ảnh
                            </span>
                          </Col>
                          <Col span={11} className="flex items-center ">
                            <span className="text-xl text-black font-bold">
                              Tên sản phẩm
                            </span>
                          </Col>
                          <Col
                            span={3}
                            className="flex items-center justify-center"
                          >
                            <span className="text-xl text-black font-bold">
                              Giá
                            </span>
                          </Col>
                          <Col
                            span={3}
                            className="flex items-center justify-center"
                          >
                            <span className="text-xl text-black font-bold">
                              Số lượng
                            </span>
                          </Col>
                          <Col
                            span={3}
                            className="flex items-center justify-center"
                          >
                            <span className="text-xl text-black font-bold">
                              Tổng
                            </span>
                          </Col>
                        </Row>
                      </div>
                      <div>
                        {data?.orderItems?.map((item, index) => (
                          <div
                            key={index}
                            className="p-8"
                            style={{ borderBottom: "1px solid #e9ecef" }}
                          >
                            <Row key={index}>
                              <Col
                                span={1}
                                className="flex items-center justify-center"
                              >
                                <span className="text-lg text-black text-bold">
                                  {index + 1}
                                </span>
                              </Col>
                              <Col span={3}>
                                <div className="flex items-center justify-center">
                                  <img
                                    src={item?.image}
                                    alt={item?.name}
                                    style={{ maxWidth: "40px" }}
                                  />
                                </div>
                              </Col>
                              <Col span={11} className="flex items-center ">
                                <span className="text-lg text-black text-bold">
                                  {item?.name}
                                </span>
                              </Col>
                              <Col
                                span={3}
                                className="flex items-center justify-center"
                              >
                                <span className="text-lg text-black text-bold">
                                  {item?.price}
                                </span>
                              </Col>
                              <Col
                                span={3}
                                className="flex items-center justify-center"
                              >
                                <span className="text-lg text-black text-bold">
                                  {item?.amount}
                                </span>
                              </Col>
                              <Col
                                span={3}
                                className="flex items-center justify-center"
                              >
                                <span className="text-lg text-black text-bold">
                                  {item?.price}
                                </span>
                              </Col>
                            </Row>
                            {/* <Divider /> */}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="bg-white  shadow-2xl ">
                          <div className="p-8" style={{ background: "#f8f9fa" }}>
                            <h1 className="text-2xl font-bold">Tổng tiền thanh toán</h1>
                          </div>
                          <div className="p-8"
                            style={{ borderBottom: "1px solid #e9ecef" }}>
                            <Row>
                              <Col span={12}>
                              <h1 className="text-xl font-medium">Tiền đơn hàng</h1>
                              </Col>
                              <Col span={12}>
                              <h1 className="text-xl font-medium">{convertPrice(data?.itemsPrice)}</h1>
                              </Col>
                            </Row>
                          </div>
                          <div className="p-8"
                            style={{ borderBottom: "1px solid #e9ecef" }}>
                            <Row>
                              <Col span={12}>
                              <h1 className="text-xl font-medium">Tiền giao hàng</h1>
                              </Col>
                              <Col span={12}>
                              <h1 className="text-xl font-medium">{convertPrice(data?.shippingPrice)}</h1>
                              </Col>
                            </Row>
                          </div>
                          <div className="p-8"
                            style={{ borderBottom: "1px solid #e9ecef" }}>
                            <Row>
                              <Col span={12}>
                              <h1 className="text-xl font-medium">Tổng tiền</h1>
                              </Col>
                              <Col span={12}>
                              <h1 className="text-3xl font-bold">{convertPrice(data?.totalPrice)}</h1>
                              </Col>
                            </Row>
                          </div>

                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="bg-white  shadow-2xl ">
                          <div className="p-8" style={{ background: "#f8f9fa" }}>
                            <h1 className="text-2xl font-bold">Thông tin người mua</h1>
                          </div>
                          <div className="p-8"
                            style={{ borderBottom: "1px solid #e9ecef" }}>
                            <Row>
                              <Col span={12}>
                              <h1 className="text-xl font-medium">Tên người nhận</h1>
                              </Col>
                              <Col span={12}>
                              <h1 className="text-xl font-medium">{data?.shippingAddress?.fullName}</h1>
                              </Col>
                            </Row>
                          </div>
                          <div className="p-8"
                            style={{ borderBottom: "1px solid #e9ecef" }}>
                            <Row>
                              <Col span={12}>
                              <h1 className="text-xl font-medium">Số điện thoại</h1>
                              </Col>
                              <Col span={12}>
                              <h1 className="text-xl font-medium">0{data?.shippingAddress?.phone}</h1>
                              </Col>
                            </Row>
                          </div>
                          <div className="p-8"
                            style={{ borderBottom: "1px solid #e9ecef" }}>
                            <Row>
                              <Col span={12}>
                              <h1 className="text-xl font-medium">Địa chỉ</h1>
                              </Col>
                              <Col span={12}>
                              <h1 className="text-sm font-medium">{`${data?.shippingAddress?.street}, ${data?.shippingAddress?.ward}, ${data?.shippingAddress?.district}, ${data?.shippingAddress?.city}`}</h1>
                              </Col>
                            </Row>
                          </div>
                          <div className="p-8"
                            style={{ borderBottom: "1px solid #e9ecef" }}>
                            <Row>
                              <Col span={12}>
                              <h1 className="text-xl font-medium">Phương thức thanh toán</h1>
                              </Col>
                              <Col span={12}>
                              <h1 className="text-xl font-medium">{data?.paymentMethos === "later_money" ? "Trả băng tiền mặt" : "Thanh toán paypal"}</h1>
                              </Col>
                            </Row>
                          </div>
                        

                    </div>
                  </Col>
                </Row>
              </Col>

              {/* Thông tin cá nhân */}
              
            </Row>
          </div>
        </div>
      </LoadingComponent>
      <ServiceComponent />
    </div>
  );
};

export default DetailsOrderPage;
