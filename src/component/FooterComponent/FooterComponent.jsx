import { Col, Row, Space } from "antd";
import logo from "../../assets/images/logo (5).png";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import InputComponent from "../InputComponent/InputComponent";

const FooterComponent = () => {
  return (
    <div className="bg-black text-white footer">
      <Row className="py-20 mx-10">
        <Col span={9}>
          <div className="w-2/4">
            <img src={logo} alt="logo" className="w-full h-full" />
          </div>
          <div className="ml-10 mt-10">
            <p className="mb-5 text-2xl">Can we help you?</p>
            <div>
              <InputComponent
                placeholder="Your email adress"
                style={{ fontSize: "20px", color: "black" }}
              />
              <ButtonComponent
                textButton={"Subscribe now"}
                className="mt-5 text-white"
              />
            </div>
          </div>
        </Col>
        <Col span={12} offset={2}>
          <Row>
            <Col span={8}>
              <p className=" text-2xl font-bold mb-8">Shop</p>
              <h3 className="text-base mb-3">For Women</h3>
              <h3 className="text-base mb-3">For Men</h3>
              <h3 className="text-base mb-3">Stores</h3>
              <h3 className="text-base mb-3">Our Blog</h3>
              <h3 className="text-base mb-3">Shop</h3>
            </Col>
            <Col span={8}>
              <p className=" text-2xl font-bold mb-8">Company</p>
              <h3 className="text-base mb-3">Login</h3>
              <h3 className="text-base mb-3">Cart</h3>
              <h3 className="text-base mb-3">Our Product</h3>
              <h3 className="text-base mb-3">Checkout</h3>
            </Col>
            <Col span={8}>
              <p className=" text-2xl font-bold mb-8">Your Accout</p>
              <h3 className="text-base mb-3">Checkout</h3>
              <h3 className="text-base mb-3">Checkout</h3>
              <h3 className="text-base mb-3">Checkout</h3>
              <h3 className="text-base mb-3">Checkout</h3>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default FooterComponent;
