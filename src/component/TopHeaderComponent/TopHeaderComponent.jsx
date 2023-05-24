import { Col, Row, Space } from "antd";
import { Dropdown } from "antd";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { BsTelephone } from "react-icons/bs";
import { HiOutlineGlobeAlt } from "react-icons/hi2";
import { useState } from "react";
const TopHeaderComponent = () => {
  const [open, setOpen] = useState(false);
  const items = [
    {
      label: "Tiếng Việt",
      key: "1",
    },
  ];

  const handleOpenChange = (flag) => {
    setOpen(flag);
  };

  return (
    <div className="container pt-3">
      <Row gutter={[16, 24]} align="middle" className="max-w-full">
        <Col span={12}>
          <Row className="flex" align="middle">
            <Col lg={1} sm={2} xs={3}>
              <FaFacebookF />
            </Col>
            <Col lg={1} sm={2} xs={3}>
              <FaTwitter />
            </Col>
            <Col className="flex items-center">
              <BsTelephone />
              <span className="sm:text-lg xs:text-base pl-2 font-light"
                style={{color: "#343a40"}}
              >0943084519</span>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row className="flex-row-reverse">
            <Col
              className="flex items-center pl-3 cursor-pointer"
              style={{
                borderLeft: "1px solid #ccc",
              }}
            >
              <Dropdown
                menu={{
                  items,
                }}
                open={open}
                onOpenChange={handleOpenChange}
              >
                <HiOutlineGlobeAlt className="text-xl" />
              </Dropdown>
            </Col>
            <Col>
              <span className="sm:text-lg xs:text-base pr-2 font-light" 
               style={{color: "#343a40"}}>Trợ giúp</span>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
export default TopHeaderComponent;
