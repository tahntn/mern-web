import { Row, Col } from "antd";
const ServiceComponent = () => {
  return (
    <div className="bg-gray-100 my-[120px]">
      {/* <div className=" py-10"> */}
        <Row>
          <Col
            lg={6}
            sm={12}
            xs={12}
         
          >
            <Row  className="flex items-center justify-center pt-3">
              <Col span={2}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/411/411763.png"
                  alt="shipping"
                  style={{ width: "100%" }}
                />
              </Col>
              <Col span={1}></Col>
              <Col span={21}>
                <span className="text-base xs:text-sm font-black">Miễn phí giao hàng </span>
                <br />
                <span className="xs:text-xs  text-gray-500">Khi vượt quá 500.000 VNĐ</span>
              </Col>
            </Row>
          </Col>
          <Col
            lg={6}
            sm={12}
            xs={12}
           
          >
            <Row  className="flex items-center justify-center pt-3">
              <Col span={2} >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3037/3037156.png"
                  alt="money"
                  style={{ width: "100%" }}
                />
              </Col>
              <Col span={1}></Col>
              <Col span={21}>
                <span className="text-base xs:text-sm font-black">Hoàn trả sản phẩm</span>
                <br />
                <span className="xs:text-xs text-gray-500">Trong 1 tuần</span>
              </Col>
            </Row>
          </Col>
          <Col
            lg={6}
            sm={12}
            xs={12}
            
          >
            <Row  className="flex items-center justify-center pt-3">
              <Col span={2} >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2854/2854306.png"
                  alt="shipping"
                  style={{ width: "100%" }}
                />
              </Col>
              <Col span={1}></Col>
              <Col span={21}>
                <span className="text-base xs:text-sm font-black">Giá cả hợp lý</span>
                <br />
                <span className="xs:text-xs text-gray-500">Luôn là lựa chọn đúng đắn</span>
              </Col>
            </Row>
          </Col>
          <Col
            lg={6}
            sm={12}
            xs={12}
           
          >
            <Row  className="flex items-center justify-center pt-3">
              <Col span={2} >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1067/1067566.png"
                  alt="shipping"
                  style={{ width: "100%" }}
                />
              </Col>
              <Col span={1}></Col>
              <Col span={21}>
                <span className="text-base xs:text-sm font-black">0943-084-518</span>
                <br />
                <span className="xs:text-xs text-gray-500">Hỗ trợ 24/7</span>
              </Col>
            </Row>
          </Col>
        </Row>
      {/* </div> */}
    </div>
  );
};
export default ServiceComponent;
