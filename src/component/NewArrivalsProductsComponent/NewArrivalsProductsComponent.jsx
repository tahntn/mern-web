import { Button, Col, Row } from "antd";
import { useState } from "react";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import CardComponent from "../CardComponent/CardComponent";
import LoadingComponent from "../LoadingComponent/LoadingComponent";


const NewArrivalsProductsComponent = ({ products, isLoading }) => {
  const [limit, setLimit] = useState(12);
  const handleClick = () => {
    setLimit(limit + 6);
  };
  return (
    <div className="my-10" >
    <LoadingComponent isLoading={isLoading}>
      <Row gutter={[16, 24]}>
   
        {products?.slice(0, limit).map((product, index) => (
          <Col xl={4} lg={6} md={8} sm={12} xs={12}  key={product._id}  data-aos="zoom-in">
            <CardComponent
              id={product._id}
              price={product.price}
              name={product.name}
              type={product.type}
              description={product.description}
              image={product.image}
              color={product.color}
              totalrating={product.totalrating}
              sold={product.sold}
              note={product?.note}
              quantity={product?.quantity}
              instruction={product?.instruction}
            />
          </Col>
        ))}
      </Row>
     
    
     { limit < products?.length && <Row onClick={handleClick} className="flex justify-center mt-10">
       <ButtonComponent
        textButton={"Tải thêm"}
        styleButton={{
          background: "black"
        }}
        styleTextButton={{
          color: "white"
        }}
       />
      </Row>}
    </LoadingComponent>
      
    </div>
  );
};

export default NewArrivalsProductsComponent;
