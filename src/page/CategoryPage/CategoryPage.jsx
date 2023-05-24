import React, { useEffect, useState } from "react";
import { Row, Col, Pagination, Breadcrumb, Divider } from "antd";
import SidebarComponent from "../../component/SidebarComponent/SidebarComponent";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import CardComponent from "../../component/CardComponent/CardComponent";
import { useLocation } from "react-router-dom";
import * as ProductService from "../../service/ProductService";
import { useDebounce } from "../../hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "../../component/LoadingComponent/LoadingComponent";
import CategoryComponent from "../../component/CategoryComponent/CategoryComponent";
import usePagination from "../../hooks/usePagination";
import BreadcrumbComponent from "../../component/BreadcrumbComponent/BreadcrumbComponent";
// import { searchProduct } from "../../features/product/productSlice";
import Aos from "aos";
import "aos/dist/aos.css";
import { searchProduct } from "../../features/product/productSlice";
import { AiFillFilter } from "react-icons/ai";
import DrawerCategoryComponent from "../../component/DrawerCategoryComponent/DrawerCategoryComponent";
import ServiceComponent from "../../component/ServiceComponent/ServiceComponent";
const CategoryPage = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (state) {
      dispatch(searchProduct(state));
    }
  }, []);

  const { allProducts, filterProduct } = useSelector((state) => state?.product);
  // const [state, setState] = useState()
  const [products, setProducts] = useState([]);

  const [page, setPage] = useState(1);
  const PER_PAGE = 12;
  const count = Math.ceil(products.length / PER_PAGE);
  const DATA = usePagination(products, PER_PAGE);

  const handleChange = (e, p) => {
    window.scrollTo(10, 0);
    setPage(e);
    DATA.jump(e);
  };

  const handleShowSizeChange = (current, size) => {
    console.log("log", current, size);
  };

  const handleChangePage = () => {
    // setPage(1);
  };
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    setProducts(filterProduct);
  }, [filterProduct]);

  useEffect(() => {
    Aos.init();
  }, []);

  return (
    <>
      <div className="spacingPage">
        <Row className="items-star  justify-between">
          <Col>
            <BreadcrumbComponent title={"Category"} />
          </Col>
        </Row>
        <Row className=" xl:hidden cursor-pointer items-center pb-2">
          <Col onClick={showDrawer}>
            <AiFillFilter className="text-2xl sm:text-xl" />
          </Col>
          <Col onClick={showDrawer}>
            <span className="text-2xl sm:text-xl pl-2">Danh mục sản phẩm</span>
          </Col>
        </Row>

        {/* <LoadingComponent isLoading={loading}> */}
        <Row>
          <Col xl={6} sm={0} xs={0}>
            <CategoryComponent handleChangePage={handleChangePage} />
          </Col>
          <Col xl={18} sm={24} xs={24} className="xl:pl-5">
            <Row className="bg-white">
              {products.length > 0 && (
                <Col span={24}>
                  <span className="text-3xl p-2.5">{products.length} sản phẩm</span>
                </Col>
              )}
              {DATA.currentData().map((product) => (
                <Col
                  xl={6}
                  md={8}
                  sm={12}
                  xs={12}
                  key={product._id}
                  className="p-2.5"
                >
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
              {DATA.currentData().length === 0 && (
                <Col span={24}>
                  <span className="text-3xl py-5 px-10">
                    Không có sản phẩm phù hợp
                  </span>
                </Col>
              )}
              {DATA.currentData().length > 0 && (
                <Col span={24}>
                  <Pagination
                    total={count}
                    pageSize={1}
                    current={page}
                    // count={count}
                    // page={page}
                    // variant="outlined"
                    // shape="rounded"
                    onChange={handleChange}
                    responsive={"true"}
                    onShowSizeChange={handleShowSizeChange}
                    // size='large'
                    className="pb-2"
                  />
                </Col>
              )}
            </Row>
            {/* <Pagination
              defaultCurrent={panigate.page + 1}
              total={panigate.total}
              onChange={onChange}
              pageSize={panigate.limit}
            /> */}
          </Col>
        </Row>
        <Divider />
        <ServiceComponent />
        {/* </LoadingComponent> */}
      </div>

      <DrawerCategoryComponent open={open} onClose={onClose} />
    </>
  );
};

export default CategoryPage;
