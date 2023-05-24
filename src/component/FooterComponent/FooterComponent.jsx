import { Col, Row, Space } from "antd";
import logo from "../../assets/images/logoWhite.png";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import InputComponent from "../InputComponent/InputComponent";
import { FacebookFilled } from "@ant-design/icons";
import gmail from "../../assets/images/gmail.png";
import facebook from "../../assets/images/facebook.png";
import phone from "../../assets/images/phone-call.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const FooterComponent = () => {
  const navigate = useNavigate();
  const { access_token } = useSelector((state) => state.auth);

  return (
    <div className="bg-black text-white footer">
      <Row className="py-20 mx-10">
      <Col xl={2} className="xl:block sm:hidden xs:hidden"></Col>
        <Col xl={7} lg={9} sm={24} xs={24} >
          <Row className="items-center">
            <Col xl={16} lg={16} md={6} sm={5} xs={6}> 
              <img src={logo} alt="logo" className="w-full h-full" />
            </Col>
            <Col lg={2} sm={2} className="sm:block xl:hidden  xs:hidden"></Col>
            <Col xl={24} lg={24} md={16} sm={17} xs={23}>
            <p className="mb-5 text-2xl">Chúng tôi có thể giúp gì cho bạn?</p>
            <div>
              <InputComponent
                placeholder="Địa chỉ email"
                style={{ fontSize: "20px", color: "black" }}
              />
              <ButtonComponent
                textButton={"Đăng ký ngay"}
                styleTextButton={{
                  color: "white",
                }}
                className="mt-5 text-white"
              />
            </div>
            </Col>
          </Row>
         
        </Col>
        <Col xl={2} lg={1} className="lg:block sm:hidden xs:hidden"></Col>
        <Col xl={12} lg={14} sm={24} xs={24} className="sm:pt-10 xs:pt-10 lg:mt-0" >
          <Row>
            <Col sm={!access_token ? 12 : 8} xs={12}>
              <p className=" md:text-2xl sm:text-xl font-bold mb-8">Cửa hàng</p>
              <h3 className="md:text-base sm:text-sm mb-3">Trang chủ</h3>
              <h3 className="md:text-base sm:text-sm mb-3">Sản phẩm</h3>
              <h3 className="md:text-base sm:text-sm mb-3">Liên hệ</h3>
              {access_token && (
                <>
                  <h3 className="md:text-base sm:text-sm mb-3">Giỏ hàng của bạn</h3>
                  <h3 className="md:text-base sm:text-sm mb-3">Đơn hàng của bạn</h3>
                </>
              )}
            </Col>
            {access_token && (
              <Col sm={8} xs={12}>
                <p className="md:text-2xl sm:text-xl font-bold mb-8">Tài khoản</p>
                <h3 className="md:text-base sm:text-sm mb-3">Thông tin tài khoản</h3>
                <h3 className="md:text-base sm:text-sm mb-3">Giỏ hàng của bạn</h3>
                <h3 className="md:text-base sm:text-sm mb-3">Đơn hàng của bạn</h3>
                {/* <h3 className="md:text-base sm:text-sm mb-3">Checkout</h3> */}
              </Col>
            )}
            <Col sm={!access_token ? 12 : 8} xs={12} className={access_token && "xs:pt-5"}>
              <p className="md:text-2xl sm:text-xl font-bold mb-8">Liên hệ</p>
              <h3 className="md:text-base sm:text-sm mb-3 text-blue-700 flex">
                <div className="w-6">
                  <img src={facebook} alt="facebook" className="w-full" />
                </div>
                <span className="text-white pl-3">NO Store</span>
              </h3>
              <h3 className="md:text-base sm:text-sm mb-3 flex">
                <div className="w-6">
                  <img src={gmail} alt="gmail" className="w-full" />
                </div>
                <span className=" text-white pl-3">ntnhat@gmail.com</span>
              </h3>
              <h3 className="md:text-base sm:text-sm mb-3 flex">
                <div className="w-6">
                  <img src={phone} alt="phone" className="w-full" />
                </div>
                <span className="text-white pl-3">0943084519</span>
              </h3>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default FooterComponent;
