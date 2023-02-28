import React from "react";
import { Row, Col } from "antd";
import SidebarComponent from "../../component/SidebarComponent/SidebarComponent";

const ProductPage = () => {
  return (
    <div>
      <Row>
        <Col span={6}>
          <SidebarComponent
            label="Brand"
            type="checkbox"
            option={[
              { value: "a", label: "Calvin Klein" },
              { value: "b", label: "Levi Strauss" },
              { value: "c", label: "Hugo Boss " },
            ]}
          />
        
        </Col >
        <Col span={18}></Col>
      </Row>
    </div>
  );
};

export default ProductPage;
