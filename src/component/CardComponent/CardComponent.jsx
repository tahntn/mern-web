import { useLocation, useNavigate } from "react-router-dom";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import { Card, Modal, Rate } from "antd";
import { convertPrice } from "../../utils";
import { useEffect, useState } from "react";
import { AiOutlineCompress } from "react-icons/ai";
import * as ProductService from "../../service/ProductService";
import {
  success as MessSuccess,

} from "../../component/MessageComponent/MessageComponent";
import StarComponent from "../StarComponent/StarComponent";
import ModalProductDetailComponent from "../ModalProductDetailComponent/ModalProductDetailComponent";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../service/UserService";
import { updateUser1 } from "../../features/auth/authSlice";

const CardComponent = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const [isHover, setIsHover] = useState(false);
  const [isHoverName, setIsHoverName] = useState(false);
  const [open, setOpen] = useState(false)
  const {
    name,
    price,
    id,
    image,
    description,
    totalrating,
    sold,
    type,
    quantity,
    note,
    instruction,
  } = props;

  const handelClickProduct = () => {
    navigate(`/product-detail/${id}`);
  };

  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const handleMouseEnterName = () => {
    setIsHoverName(true)
  };
  const handleMouseLeaveName = () => {
    setIsHoverName(false);
  };

  const handleOpenModal = () => {
    setOpen(true)
  }

  const styleCard = {};

  const styleMore = {
    position: "absolute",
    opacity: isHover ? 1 : 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: "20%",
    padding: "0 12px",
    background: "rgba(255,255,255,0.92)",
    transition: "all 0.3s",
    transform: isHover ? "translateY(0rem)" : "translateY(3rem)",
  };

  const styleStar = {
    transition: "all 0.4s",
    opacity: isHover ? 1 : 0,
    transform: isHover ? "translateY(0rem)" : "translateY(3rem)",
  }
  const styleName = {
    marginTop: " 16px",
    fontSize: "15px",
    fontWeight: "600",
    textDecoration: isHoverName ? "underline" :  "none"
  }
  const mutationAddCart = useMutationHooks((data) =>
  ProductService.addToWishList(data)
);
  const { isSuccess: isSuccessAddCart } = mutationAddCart;

  const  handleAddOrderProduct = (id) => {
    if (!user?.id) {
      navigate("/login", { state: location?.pathname });
    } else {
      mutationAddCart.mutate({
        amount: 1,
        prodId: id,
        access_token: user?.access_token,
      });
    }
  }

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

  return (
    <>
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}

      // className="cursor-pointer"
    >
      <div className="relative">
        {quantity === 0 && <div>bán hết</div>}
        <div className="h-64 cursor-pointer " 
          onClick={() => navigate(`/product-detail/${id}`)}
        >
          <img
            src={isHover ? image[0] : image[1]}
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div style={styleMore}>
          <span 
            className="hover:underline cursor-pointer"
            onClick={() => handleAddOrderProduct(id)}
            >Thêm vào giỏ hàng</span>
          <div 
           className="cursor-pointer "
           onClick={handleOpenModal}
          >
            <AiOutlineCompress />
          </div>
        </div>
      </div>
      <div className="px-1">
        <h6
          style={styleName}
          className="h-11 cursor-pointer"
          onMouseEnter={handleMouseEnterName}
          onMouseLeave={handleMouseLeaveName}
          onClick={() => navigate(`/product-detail/${id}`)}
        >
          {name}
        </h6>
        <div className="flex items-center justify-between ">
          <span
            style={{
              color: "#868e96",
              fontWeight: 600,
            }}
          >
            {convertPrice(price)}
          </span>
          <span
            style={styleStar}
            // className="xs:hidden"
          >
            <StarComponent star={totalrating} />
          </span>
        </div>
      </div>
    </div>
    <ModalProductDetailComponent
    open={open}
      handleOK={() => setOpen(false)}
      handleCancel={() => setOpen(false)}
      image={image}
      name={name}
      type={type}
      quantity={quantity}
      sold={sold}
      price={price}
      totalrating={totalrating}
      description={description}
      instruction={instruction}
      note={note}
      id={id}
     />
    </>
  
  );
};

export default CardComponent;
