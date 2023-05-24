import { Col, Row } from "antd";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import CardComponent from "../CardComponent/CardComponent";
import NewArrivalsProductsComponent from "../NewArrivalsProductsComponent/NewArrivalsProductsComponent";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
const NewArrivalsComponent = () => {
  const { allProducts, isLoading } = useSelector((state) => state.product);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    setProducts(allProducts);
  }, [allProducts]);
  const handleClickBestSellingProduct = () => {
    let updatedProduct = [...products].sort(function (a, b) {
      return b.sold - a.sold;
    });
    setProducts(updatedProduct);
  };
  const handleClickNewProduct = () => {
    let updatedProduct = [...allProducts]?.reverse();
    setProducts(updatedProduct);
  };

  const handleClickHighlyRatedProduct = () => {
    let updatedProduct = [...products].sort(function (a, b) {
      return b.totalrating - a.totalrating;
    });
    setProducts(updatedProduct);
  };
  useEffect(() => {
    Aos.init();
  }, []);
  return (
    <div className="spacingPage newArrivals">
      <p
        style={{ textAlign: " center", margin: "60px 0px" }}
        data-ao1="zoom-in-up"
        className="lg:text-5xl sm:text-3xl xs:text-2xl"
      >
        NHỮNG SẢN PHẨM NỔI BẬT{" "}
      </p>
      <div>
        <Row>
          <ButtonComponent
            onClick={handleClickBestSellingProduct}
            textButton={"Sản phẩm bán chạy"}
          />
          <ButtonComponent
            onClick={handleClickNewProduct}
            textButton={"Sản phẩm mới"}
          />
          <ButtonComponent
            onClick={handleClickHighlyRatedProduct}
            textButton={"Sản phẩm có lượt đánh giá cao"}
          />
        </Row>
        <NewArrivalsProductsComponent
          products={products}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
export default NewArrivalsComponent;
