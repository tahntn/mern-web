import { Col, Divider, Row } from "antd";
import contact from "../../assets/images/contact.jpg";
import ServiceComponent from "../../component/ServiceComponent/ServiceComponent";
import { useNavigate } from "react-router-dom";
function Iframe(props) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: props.iframe ? props.iframe : "" }}
    />
  );
}
const ContactPage = () => {
    const navigate = useNavigate()
  const iframe =
    '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.812381649802!2d105.83975357517562!3d21.00015658064204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac70a2f48a15%3A0xfc5dfbb8602d0eef!2zMjA3IEdp4bqjaSBQaMOzbmcsIMSQ4buTbmcgVMOibSwgxJDhu5FuZyDEkGEsIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1682235991437!5m2!1svi!2s" width="100%" height="550" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" ></iframe>';
  return (
    <div className="">
      <div className="relative">
        <div
          style={{
            height: "475px",
          }}
        >
          <img src={contact} className="w-full h-full object-cover" />
        </div>
        <div className="absolute" style={{
            top: "55%",
            left: "40%"
        }}>
            <span className="text-3xl font-bold">
                <span className="cursor-pointer" onClick={() => navigate("/")}>Trang chủ</span>
                - Liên hệ
            </span>
        </div>
      </div>
      <div className="spacingPage">
        <Row gutter={[72, 48]} className="py-[90px]">
          <Col span={8}>
            <span className="text-3xl font-bold">Địa chỉ</span>
            <div>
              <span className="text-xl font-medium text-gray-400">
                Số 207 đường Giải Phóng, quận Hai Bà Trưng, thành phố Hà Nội
              </span>
            </div>
          </Col>
          <Col span={8}>
            <span className="text-3xl font-bold">Trung tâm cuộc gọi</span>
            <div>
              <span className="text-xl font-medium text-gray-400">
                +84 1235678
              </span>
            </div>
          </Col>
          <Col span={8}>
            <span className="text-3xl font-bold">Dịch vụ hỗ trợ</span>
            <div>
              <span className="text-xl font-medium text-gray-400">
                ntnhat.267@gmail.com
              </span>
              <br />
              <span className="text-xl font-medium text-gray-400">
                nostore@gmail.com
              </span>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <div>
              <Iframe iframe={iframe} />,
            </div>
          </Col>
          <Col span={14} className="bg-gray-300">
            <div className="py-[90px] pl-[50px]">
              <span className="text-5xl font-black text-gray-500">
                Cửa hàng chúng tôi
              </span>
              <div className="pt-[50px]">
                <Row className="items-center">
                  <Col span={6}>
                    <span className="text-2xl font-bold">Hà Nội</span>
                  </Col>
                  <Col span={6}>
                    <span className="text-sm font-medium">
                      {" "}
                      Số 207 đường Giải Phóng, quận Hai Bà Trưng
                    </span>
                  </Col>
                  <Col span={4}>
                    <span className="text-sm font-medium"> +987654321</span>
                  </Col>
                  <Col span={8}>
                    <span className="text-sm font-medium">
                      {" "}
                      nostore@gmail.com
                    </span>
                  </Col>
                  <Divider />
                </Row>
                <Row className="items-center">
                  <Col span={6}>
                    <span className="text-2xl font-bold">Đà Nẵng</span>
                  </Col>
                  <Col span={6}>
                    <span className="text-sm font-medium">
                      71 Ngũ Hành Sơn, Bắc Mỹ An, Ngũ Hành Sơn
                    </span>
                  </Col>
                  <Col span={4}>
                    <span className="text-sm font-medium"> +0943084519</span>
                  </Col>
                  <Col span={8}>
                    <span className="text-sm font-medium">
                      {" "}
                      no.store.dn@gmail.com
                    </span>
                  </Col>
                  <Divider />
                </Row>
                <Row className="items-center">
                  <Col span={6}>
                    <span className="text-xl font-bold">T.P Hồ Chí Minh</span>
                  </Col>
                  <Col span={6}>
                    <span className="text-sm font-medium">
                      59C Nguyễn Đình Chiểu, Phường 6, Quận 3
                    </span>
                  </Col>
                  <Col span={4}>
                    <span className="text-sm font-medium"> +987654321</span>
                  </Col>
                  <Col span={8}>
                    <span className="text-sm font-medium">
                      {" "}
                      no.store.hcm@gmail.com
                    </span>
                  </Col>
                  <Divider />
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className="spacingPage">
        <ServiceComponent />
      </div>
    </div>
  );
};

export default ContactPage;
