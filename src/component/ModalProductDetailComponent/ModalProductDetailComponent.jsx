import { Col, InputNumber, Modal, Rate, Row } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper";
import { useEffect, useState } from "react";
import * as ProductService from "../../service/ProductService";
import * as UserService from "../../service/UserService";

import { convertPrice } from "../../utils";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import {
    success as MessSuccess,
    error as MessError,
  } from "../../component/MessageComponent/MessageComponent";
  
import { useMutationHooks } from "../../hooks/useMutationHook";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { updateUser1 } from "../../features/auth/authSlice";
const ModalProductDetailComponent = ({
  open,
  handleOK,
  handleCancel,
  image,
  name,
  type,
  quantity,
  sold,
  price,
  totalrating,
  description,
  instruction,
  id,
  note,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.auth);
  const [numProduct, setNumProduct] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const onChange = (value) => {
    setNumProduct(Number(value));
  };
  const mutationAddCart = useMutationHooks((data) =>
    ProductService.addToWishList(data)
  );
  const { isSuccess: isSuccessAddCart } = mutationAddCart;

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
        prodId: id,
        access_token: user?.access_token,
      });
    }
  };

  return (
    <Modal
      title={name}
      style={{
        top: 90,
      }}
      open={open}
      onOk={handleOK}
      onCancel={handleCancel}
      width={1000}
      footer={[]}
    >
      <Row>
        <Col span={8} className="pr-6">
          <Swiper
            style={{
              "--swiper-navigation-color": "#fff",
              "--swiper-pagination-color": "#fff",
            }}
            spaceBetween={10}
            // navigation={true}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Thumbs]}
            className="mySwiper2"
          >
            {image?.map((item, index) => (
              <SwiperSlide key={index} className="h-60">
                <img src={item} alt="anhr" className="w-full h-full" />
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
            {image?.map((item, index) => (
              <SwiperSlide key={index}>
                <img src={item} alt="anh-trang-phuc" />
              </SwiperSlide>
            ))}
          </Swiper>
        </Col>
        <Col span={16} className="pl-6">
          <h1 className="text-3xl font-light pb-1">{name}</h1>
          <h2 className="text-xl font-bold py-3">
            Danh mục sản phẩm:{" "}
            <span className="font-normal capitalize">{type}</span>
          </h2>

          <span className="text-2xl font-extrabold text-current py-3">
            Giá: {convertPrice(price)}
          </span>
          <div className="flex items-center">
            <h3>
              <Rate disabled value={totalrating} />
              <span className="pl-3">({totalrating} sao)</span>
            </h3>
          </div>
          <div>
            <h5
              className="text-base font-medium text-gray-500 py-2"
              style={{
                color: "#868e96 !important",
              }}
            >
              {description}
            </h5>
          </div>
          <h2 className="text-xl font-bold py-3">
            Đã bán: <span className="text-lg font-normal"> {sold}</span>{" "}
          </h2>
          <h2 className="text-xl font-bold py-1">
            Số lượng trong kho:{" "}
            <span className="text-lg font-normal"> {quantity}</span>{" "}
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
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalProductDetailComponent;
