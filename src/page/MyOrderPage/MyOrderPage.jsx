import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonComponent from "../../component/ButtonComponent/ButtonComponent";
import LoadingComponent from "../../component/LoadingComponent/LoadingComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as OrderService from "../../service/OrderService";
import { convertPrice } from "../../utils";
import BreadcrumbComponent from "../../component/BreadcrumbComponent/BreadcrumbComponent";
import { Col, Tabs, Row, Tag, Divider, Tooltip, Modal } from "antd";
import Moment from "react-moment";
import { CloseCircleOutlined, CloseOutlined } from "@ant-design/icons";
import {success as MessSuccess} from "../../component/MessageComponent/MessageComponent"
const MyOrderPage = () => {
  const [myOrder, setMyOrder] = useState([]);
  const [orderId, setOrderId] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false)
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(
      state?.id,
      state?.access_token
    );
    setMyOrder(res.data);
    return res.data;
  };

  const queryOrder = useQuery(
    { queryKey: ["orders"], queryFn: fetchMyOrder },
    {
      enabled: state?.id && state?.access_token,
    }
  );

  const { isLoading, data } = queryOrder;

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.access_token,
      },
    });
  };

  const mutation = useMutationHooks((data) => {
    const { id, orderItems } = data;
    const res = OrderService.cancelOrder(id,  orderItems);
    return res;
  });

  const handleCanceOrder = () => {
    // console.log(order,a);
    mutation.mutate(
      {
        id: orderId,
        // token: state?.access_token,
        orderItems: orderItems,
      },
      {
        onSuccess: () => {
          queryOrder.refetch();
        },
      }
    );
    setOpen(false)
  };
  const {
    isLoading: isLoadingCancel,
    isSuccess: isSuccessCancel,
    isError: isErrorCancle,
    data: dataCancel,
  } = mutation;

  const showModal = (id, data) => {
    setOpen(true)
    setOrderId(id)
    setOrderItems(data)
  }

  const closeModal = () => {
    setOpen(false)
  }


  useEffect(() => {
    if(isSuccessCancel && dataCancel?.status === "SUCCESS"){
      MessSuccess("Xóa đơn hàng thành công")
    }
    // if (isSuccessCancel && dataCancel?.status === 'OK') {
    //   message.success()
    // } else if(isSuccessCancel && dataCancel?.status === 'ERR') {
    //   message.error(dataCancel?.message)
    // }else if (isErrorCancle) {
    //   message.error()
    // }
  }, [isErrorCancle, isSuccessCancel]);

  const renderProduct = (data) => (
    <div>
      {data?.length > 0 && (
        <>
          <Row>
            <Col span={1}>
              <span className="text-lg text-black text-bold">Stt</span>
            </Col>
            <Col span={6}>
              <span className="text-lg text-black text-bold">Mã đơn hàng</span>
            </Col>
            <Col span={5}>
              <span className="text-lg text-black text-bold">Thời gian</span>
            </Col>
            <Col span={3}>
              <span className="text-lg text-black text-bold">Tổng tiền</span>
            </Col>
            <Col span={4}>
              <span className="text-lg text-black text-bold">Trạng thái</span>
            </Col>
            <Col span={5}>
              <span className="text-lg text-black text-bold">Hoạt động</span>
            </Col>
          </Row>
          {data.map((order, index) => (
            <Row key={order._id}>
              <Divider />
              <Col span={1}>
                <span className="text-sm text-black text-medium">
                  {index + 1}
                </span>
              </Col>
              <Col span={6}>
                <span className="text-sm text-black text-medium">
                  {order._id}
                </span>
              </Col>
              <Col span={5}>
                <span className="text-sm text-black text-medium">
                  <Moment format="DD/MM/YYYY HH:mm:ss" withTitle>
                    {order.createdAt}
                  </Moment>
                </span>
              </Col>
              <Col span={3}>
                <span className="text-sm text-black text-medium">
                  {convertPrice(order.totalPrice)}
                </span>
              </Col>
              <Col span={4}>
                <Tag
                  color={
                    order.status === "Dispatched"
                      ? "warning"
                      : order.status === "Processing"
                      ? "processing"
                      : order.status === "Delivered"
                      ? "success"
                      : "error"
                  }
                  style={{
                    fontSize: "17px",
                    padding: "3px",
                  }}
                >
                  {order.status === "Dispatched"
                    ? "Đang giao"
                    : order.status === "Processing"
                    ? "Đang xử lý"
                    : order.status === "Delivered"
                    ? "Đã giao"
                    : "Đã hủy"}
                </Tag>
              </Col>
              <Col span={5}>
                <div className="flex">
                  <ButtonComponent
                    textButton={"Xem chi tiết"}
                    onClick={() => {
                      handleDetailsOrder(order._id);
                      window.scroll(0,0)
                    }}
                    className="text-sm text-black text-medium"
                  ></ButtonComponent>
                  {order.status === "Processing" && (
                    <Tooltip placement="top" title={"Hủy đơn hàng"}>
                      <ButtonComponent
                        className="text-sm text-black text-medium ml-1"
                        textButton={<CloseOutlined />}
                        onClick={() => showModal(order._id, order.orderItems)}
                        // () => handleCanceOrder(order._id, order.orderItems)
                      />
                    </Tooltip>
                  )}
                </div>
              </Col>
            </Row>
          ))}
        </>
      )}
      {data?.length === 0 && (
        <span className="text-2xl text-black text-bold">Chưa có sản phẩm</span>
      )}
    </div>
  );

  const items = [
    {
      key: "1",
      label: `Đã giao`,
      children: renderProduct(
        myOrder.filter((order) => order.status === "Delivered")
      ),
    },
    {
      key: "2",
      label: `Đang giao`,
      children: renderProduct(
        myOrder.filter((order) => order.status === "Dispatched")
      ),
    },
    {
      key: "3",
      label: `Đang xử lý`,
      children: renderProduct(
        myOrder.filter((order) => order.status === "Processing")
      ),
    },
    {
      key: "4",
      label: `Đã hủy`,
      children: renderProduct(
        myOrder.filter((order) => order.status === "Cancelled")
      ),
    },
    {
      key: "5",
      label: `Tất cả`,
      children: renderProduct(myOrder),
    },
  ];

  const onChange = () => {};
  return (
    <>
    <div className="spacingPage">
      <LoadingComponent isLoading={isLoading || isLoadingCancel}>
        <div>
          <BreadcrumbComponent title={"Đơn hàng của tôi"} />
          <div>
            <Row justify="center" align="top" gutter={[16]}>
              <Col span={24}>
                <div className="bg-white rounded-xl shadow-2xl ">
                  <Tabs
                    defaultActiveKey="2"
                    items={items}
                    onChange={onChange}
                    type="card"
                    className="p-5"
                  />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </LoadingComponent>
    </div>
    <Modal
        title="Xóa đánh giá"
        open={open}
        onCancel={closeModal}
        onOk={handleCanceOrder}
      >
          <span>Bạn có chắc chắn hủy đơn hàng không?</span>
      </Modal>
    </>
  );
};

export default MyOrderPage;
