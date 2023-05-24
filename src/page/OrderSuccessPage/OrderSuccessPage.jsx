import { useLocation, useNavigate } from "react-router-dom";
import { orderContant } from "../../constant";
import { convertPrice } from "../../utils";
import BreadcrumbComponent from "../../component/BreadcrumbComponent/BreadcrumbComponent";
import { Button, Result, Row, Col, Divider } from "antd";
import { useEffect, useMemo } from "react";
import ButtonComponent from "../../component/ButtonComponent/ButtonComponent";
import { useSelector } from "react-redux";
const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const { state } = location;
  useEffect(() => {
    
  }, []);
  const handleCheckMyOrder = () => {
    navigate("/my-order", {
        state: {
          id: user?.id,
          access_token: user?.access_token,
        },
      });
  }
  const handleCheckMyWishList = () => {
    navigate("/order")
  }
  const totalPriceDolamemo = useMemo(() => {
    let price = Number(state.totalPriceMemo / 30000);
    let result = Math.round(price * 100) / 100;
    return result;
  }, [state.totalPriceMemo]);
  return (
    <div style={{ background: "#f5f5fa" }} className="spacingPage">
      <BreadcrumbComponent title={"Thanh toán"} />
      <Row>
        <Col span={12}>
          <Result
            status="success"
            title="Đơn hàng của bạn đã được thành công"
            subTitle="Vui lòng check lại thông tin đơn hàng của bạn"
            extra={[
              <ButtonComponent
                textButton={"Xem Đơn hàng của bạn"}
                onClick={handleCheckMyOrder}
              />,
              <ButtonComponent
                textButton={"Xem giỏ hàng của bạn"}
                onClick={handleCheckMyWishList}
              />
            ]}
          />
        </Col>
        <Col span={12}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div>
              <div>
                <div>
                  <lable className="text-2xl font-medium">Phương thức giao hàng:</lable> {" "}
                  <span  className="text-lg font-light">
                    <span style={{ color: "#ea8500"}}>
                      {orderContant.delivery[state?.delivery]}
                    </span>{" "}
                    Giao hàng tiết kiệm
                  </span>
                </div>
              </div>
              <div>
                <div>
                  <lable className="text-2xl font-medium">Phương thức thanh toán:</lable>
                    {" "}
                  <span className="text-lg font-light">{orderContant.payment[state?.payment]}</span>
                </div>
              </div>
              <h2 className="text-xl font-medium">Sản phẩm:</h2>
              <Divider/>
              <div>
                {state.orders?.map((order) => {
                  return (
                    <>
                    <Row key={order?.name}>
                        <Col span={4}>
                        <img
                            src={order?.image}
                            style={{
                              width: "80%",
                              // height: "60px",
                              objectFit: "cover",
                            }}
                            />
                        </Col>
                        <Col span={10}>
                            <span>{order?.name}</span>
                        </Col>
                        <Col span={6}>
                        <span style={{ fontSize: "13px", color: "#242424" }}>
                            Giá tiền: {convertPrice(order?.price)}
                          </span>
                        </Col>
                        <Col span={4}>
                        <span style={{ fontSize: "13px", color: "#242424" }}>
                            Số lượng: {order?.amount}
                          </span>
                        </Col>
                   
                    </Row>
                    <Divider/>
                    </>
                  );
                })}
              </div>
              <div>
                <span style={{ color: "red" }} className="text-2xl font-medium">
                  Tổng tiền: {convertPrice(state?.totalPriceMemo)} ( {totalPriceDolamemo} $)
                </span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default OrderSuccessPage;
