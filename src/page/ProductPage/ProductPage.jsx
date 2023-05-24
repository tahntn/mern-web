import React, { useEffect, useState } from "react";
import { Row, Col, Tabs, Form, InputNumber } from "antd";
import SidebarComponent from "../../component/SidebarComponent/SidebarComponent";
import {
  success as MessSuccess,
  error as MessError,
} from "../../component/MessageComponent/MessageComponent";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { Rate } from "antd";
// import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../service/ProductService";
import LoadingComponent from "../../component/LoadingComponent/LoadingComponent";
import ButtonComponent from "../../component/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../service/UserService";
import { updateUser1 } from "../../features/auth/authSlice";
import ReviewComponent from "../../component/ReviewComponent/ReviewComponent";
import WriteReviewComponent from "../../component/WriteReviewComponent/WriteReviewComponent";
import BreadcrumbComponent from "../../component/BreadcrumbComponent/BreadcrumbComponent";
import { convertPrice } from "../../utils/index";

const ProductPage = () => {
  const { id: idProduct } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [numProduct, setNumProduct] = useState(1);
  const [initialValues, setInitialValues] = useState({
    rate: 3,
    review: "",
  });
  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    if (id) {
      const res = await ProductService.getDetailsProduct(id);
      return res.data;
    }
  };
  const queryProduct =  useQuery(
    ["product-details", idProduct],
    fetchGetDetailsProduct,
    { enabled: !!idProduct }
  );
  const handleChangeInitialValues = (values) => {
    setInitialValues({ ...initialValues, ...values });
    mutation.mutate({
      star: values.rate,
      comment: values.review,
      prodId: idProduct,
      access_token: user?.access_token,
    }, {
      onSettled: () => {
        queryProduct.refetch();
      }
    });
    handleReview()

  };

  
  const mutation = useMutationHooks((data) => UserService.reviewsProduct(data));
  const mutationAddCart = useMutationHooks((data) =>
    ProductService.addToWishList(data)
  );

  const { data, isSuccess, isLoading: isLoadingReview } = mutation;

  const { isSuccess: isSuccessAddCart } = mutationAddCart;
  const { isLoading, data: productDetails } = queryProduct;
 

  useEffect(() => {
    if (isSuccess) {
      setReviews(data?.finalproduct?.ratings);

    } else if (!isLoading) {
      setReviews(productDetails?.ratings);
    }

  }, [isSuccess, isLoading, data, productDetails]);

  useEffect(() => {
    if (isSuccessAddCart) {
      MessSuccess("Thêm vào giỏ thành công");
      handleGetDetailsUser(user?.id, user?.access_token);
    }
  }, [isSuccessAddCart]);

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser1({ ...res?.data, access_token: token }));
  };

  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate("/login", { state: location?.pathname });
    } else {
      mutationAddCart.mutate({
        amount: numProduct,
        prodId: idProduct,
        access_token: user?.access_token,
      });
    }
  };
  const onChange = (value) => {
    setNumProduct(Number(value));
  };

  const handleReview = () => {
    console.log(initialValues);
    // mutation.mutate({
    //   star: initialValues.rate,
    //   comment: initialValues.review,
    //   prodId: idProduct,
    //   access_token: user?.access_token,
    // });
    // console.log({
    //   star: initialValues.rate,
    //   comment: initialValues.review,
    //   prodId: idProduct,
    //   access_token: user?.access_token,
    // });
    // setReview("");
    // setRate(3);

    // }
  };

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  return (
    <div style={{ backgroundColor: "#f5f5f5" }} className="spacingPage">
      <BreadcrumbComponent
        title={"Category"}
        titleSecond={productDetails?.name}
      />

      <LoadingComponent isLoading={isLoading}>
        <Row className="sm:flex-col-reverse xs:flex-col-reverse md:flex-row">
          <Col xl={8} lg={12} md={12} sm={24} className="sm:pr-6 ">
            <Swiper
              style={{
                "--swiper-navigation-color": "#fff",
                "--swiper-pagination-color": "#fff",
              }}
              spaceBetween={10}
              // navigation={true}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[FreeMode, Thumbs]}
              className="mySwiper2 xs:h-96 sm:h-96 md:h-auto "
            >
              {productDetails?.image?.map((item, index) => (
                <SwiperSlide key={index} className="h-60">
                  <img
                    src={item}
                    alt="anhr"
                    className="w-full h-full object-cover object-top"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper"
            >
              {productDetails?.image?.map((item, index) => (
                <SwiperSlide key={index}>
                  <img src={item} alt="anh-trang-phuc" />
                </SwiperSlide>
              ))}
            </Swiper>
          </Col>
          <Col
            xl={16}
            lg={12}
            md={12}
            sm={24}
            className="md:pl-6 sm:pb-6 xs:pb-6 md:pb-0"
          >
            <h1 className="xl:text-3xl lg:text-2xl sm:text-xl xs:text-xl font-light pb-1">
              {productDetails?.name}
            </h1>
            <h2 className="xl:text-xl lg:text-lg sm:text-base xs-text-base font-bold py-3">
              Danh mục sản phẩm:{" "}
              <span className="font-normal capitalize">
                {productDetails?.type}
              </span>
            </h2>

            <span className="xl:text-2xl lg:text-xl sm:text-lg xs-text-lg font-extrabold text-current py-3">
              Giá: {convertPrice(productDetails?.price)}
            </span>
            <div className="flex items-center">
              <h3>
                <Rate disabled value={productDetails?.totalrating} />
                <span className="pl-3">
                  ({productDetails?.totalrating} sao)
                </span>
              </h3>
            </div>
            <div>
              <h5
                className="lg:text-base sm:text-sm xs:text-sm font-medium text-gray-500 py-2"
                style={{
                  color: "#868e96 !important",
                }}
              >
                {productDetails?.description}
              </h5>
            </div>
            <h2 className="xl:text-xl lg:text-lg sm:text-base xs:text-base font-bold py-3">
              Đã bán:{" "}
              <span className="text-lg font-normal">
                {" "}
                {productDetails?.sold}
              </span>{" "}
            </h2>
            <h2 className="xl:text-xl lg:text-lg sm:text-base xs:text-base font-bold py-1">
              Số lượng trong kho:{" "}
              <span className="xl:text-xl lg:text-lg sm:text-base xs:text-base font-normal">
                {" "}
                {productDetails?.quantity}
              </span>{" "}
            </h2>

            <div className="flex">
              <InputNumber
                size="large"
                min={1}
                max={1000}
                defaultValue={1}
                onChange={onChange}
              />

              <ButtonComponent
                className="ml-3"
                size={40}
                styleButton={{
                  background: "black",
                  height: "48px",
                  width: "220px",
                  border: "none",
                  borderRadius: "4px",
                }}
                onClick={handleAddOrderProduct}
                textButton={"Thêm vào giỏ hàng"}
                styleTextButton={{
                  color: "white",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              />
            </div>
            <div>
              <h1 class="xl:text-xl lg:text-lg sm:text-base xs:text-base font-bold py-3">
                Hướng dẫn sử dùng
              </h1>
              {productDetails?.instruction.map((item, index) => (
                <h3
                  key={index}
                  className="xl:text-lg lg:text-base sm:text-sm xs:text-sm font-normal"
                >
                  - {item}
                </h3>
              ))}
            </div>
            <div>
              <h1 class="xl:text-xl lg:text-lg md:text-base xs:text-base font-bold py-3">
                Chú ý
              </h1>
              {productDetails?.note.map((item, index) => (
                <h3
                  key={index}
                  className="xl:text-lg lg:text-base md:text-sm xs:text-sm font-normal"
                >
                  - {item}
                </h3>
              ))}
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div>
              <LoadingComponent isLoading={isLoadingReview}>
                <ReviewComponent reviews={reviews} />
              </LoadingComponent>
            </div>
          </Col>
        </Row>
        {user?.access_token && (
          <Row className="bg-white mt-10">
            <Col span={24}>
              <WriteReviewComponent
                // handleChangeRate={handleChangeRate}
                // handleChangeReview={handleChangeReview}
                handleReview={handleReview}
                initialValues={initialValues}
                handleChangeInitialValues={handleChangeInitialValues}
                // rate={rate}
                // review={review}
              />
            </Col>
          </Row>
        )}
      </LoadingComponent>
    </div>
  );
};

export default ProductPage;
