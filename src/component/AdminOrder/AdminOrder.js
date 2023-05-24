import { useQuery } from "@tanstack/react-query";
import * as OrderService from "../../service/OrderService";
import TableComponent from "../TableComponent/TableComponent";
import { Button, Divider, Drawer, Form, Row, Select, Space, Table } from "antd";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import * as message from "../../component/MessageComponent/MessageComponent";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { useSelector } from "react-redux";
import InputComponent from "../InputComponent/InputComponent";

import { Collapse } from "antd";
import { useMutationHooks } from "../../hooks/useMutationHook";
import moment from "moment";
const { Panel } = Collapse;
const AdminOrder = () => {
  const user = useSelector((state) => state?.auth);
  const [rowSelected, setRowSelected] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [stateOrderDetails, setStateOrderDetails] = useState({
    info: "",
    itemsPrice: "",
    totalPrice: "",
    paymentMethod: "",
    orderItems: [],
    status: "",
    createAt: "",
    paidAt: "",
  });

  const [form] = Form.useForm();

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder();
    return res;
  };

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrder,
  });

  const mutationUpdate = useMutationHooks((data) => {
    const { id, ...rests } = data;
    const res = OrderService.updateOrder(id, { ...rests });
    return res;
  });

  const { isLoading: isLoadingOrders, data: orders } = queryOrder;
  const {
    data: dataUpdated,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "SUCCESS") {
      message.success("Sửa thành công");
      handleCloseDrawer();
    }
    else if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.error("Đã giao hàng rồi, không thể sửa");
      handleCloseDrawer();
    }
    else if (isErrorUpdated) {
      message.error("Lỗi");
    }
  }, [isSuccessUpdated]); //ok
  const dataTable =
    orders?.data?.length &&
    orders?.data?.map((order,index) => {
      return {
        ...order,
        key: order._id,
        phone: order?.shippingAddress?.phone,
        name: order?.shippingAddress?.fullName,
        city: order?.shippingAddress?.city,
        district: order?.shippingAddress?.district,
        ward: order?.shippingAddress?.ward,
        street: order?.shippingAddress?.street,
        stt: index + 1
      };
    });

  const handleDetailsOrder = () => {
    setIsDrawerOpen(true);
  };

  const columns = [
    {
      title: "Stt",
      dataIndex: "stt",
      width: 50,
    },
    {
      title: "Đơn hàng",
      dataIndex: "orderItems",
      width: 400,
      render: (text) => {
        return text.map((item) => (
          <>
            <div key={item?._id} className="flex items-center my-2">
              <div className="h-20">
                <img src={item.image} className="h-full" />
              </div>
              <div className="pl-1">
                <h2 className="text-lg ">
                  Tên: <span className="font-medium">{item.name}</span>{" "}
                </h2>
                <h2 className="text-lg">
                  Giá: <span className="font-medium">{item.price}</span>{" "}
                </h2>
                <h2 className="text-lg">
                  Số lượng: <span className="font-medium"> {item.amount}</span>
                </h2>
              </div>
            </div>
          </>
        ));
      },
    },

    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      width: 100,
      render: (text) => (
        <span>
          {text === "later_money"
            ? "Thanh toán khi nhận hàng"
            : "Thanh toán bằng paypal"}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 100,
      render: (text) => (
        <span>
          {text === "Processing"
            ? "Đang xử lý"
            : text === "Cancelled"
            ? "Đã hủy"
            : text === "Delivered"
            ? "Đã giao"
            : "Đang giao"}
        </span>
      ),
      filters: [
        {
          text: "Đang xử lý",
          value: "Processing",
        },
        {
          text: "Đang giao",
          value: "Dispatched",
        },
        {
          text: "Đã giao",
          value: "Delivered",
        },
        {
          text: "Đã hủy ",
          value: "Cancelled",
        },
      ],
      onFilter: (value, record) => {
        if (value === "Processing") {
          return record.status === "Processing";
        } else if (value === "Dispatched") {
          return record.status === "Dispatched";
        } else if (value === "Delivered") {
          return record.status === "Delivered";
        } else if (value === "Cancelled") {
          return record.status === "Cancelled";
        }
      },
    },
    {
      title: "Thời gian giao",
      dataIndex: "paidAt",
      width: 100,
      render: (text) => {
       switch (text) {
        case undefined:
         
         return  (<span>Chưa giao</span>)
          
          case null:
          return  (<span>Chưa giao</span>)
         
        default:
        return   (<Moment format="DD-MM-YYYY HH:mm" withTitle>
          {text}
        </Moment>)
       }
      }
    },
    {
      title: "Đặt hàng vào lúc",
      dataIndex: "createdAt",
      width: 100,
      render: (text) => (
        <Moment format="DD-MM-YYYY HH:mm" withTitle>
          {text}
        </Moment>
      ),
    },
    {
      title: "Tên người nhận ",
      dataIndex: "name",
      width: 100,
    },
    {
      title: "Thông tin cá nhân nhận hàng",
      // dataIndex: "shippingAddress",
      // width: 50,
      children: [
        {
          title: "Số điện thoại",
          dataIndex: "phone",
          width: 80,
          // sorter: (a, b) => a.age - b.age,
        },
        {
          title: "Street",
          dataIndex: "street",
          width: 150,
          // sorter: (a, b) => a.age - b.age,
        },
        {
          title: "Ward",
          dataIndex: "ward",
          width: 150,
          // sorter: (a, b) => a.age - b.age,
        },
        {
          title: "District",
          dataIndex: "district",

          width: 150,
          // sorter: (a, b) => a.age - b.age,
        },
        {
          title: "City",
          dataIndex: "city",

          width: 150,
          // sorter: (a, b) => a.age - b.age,
        },
      ],
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "itemsPrice",
      width: 80,
      sorter: (a, b) => a.itemsPrice - b.itemsPrice,
    },
    {
      title: "Tổng giá ",
      dataIndex: "totalPrice",
      width: 80,
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 50,
      render: () => (
        <div>
          <EditOutlined
            style={{ fontSize: "20px", cursor: "pointer" }}
            onClick={handleDetailsOrder}
            className="pl-3"
          />
        </div>
      ),
    },
  ];

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setStateOrderDetails({
      info: "",
      itemsPrice: "",
      totalPrice: "",
      paymentMethod: "",
      orderItems: [],
      status: "",
      createAt: "",
      paidAt: "",
    });
    form.resetFields();
  };
  const fetchGetDetailsOrder = async (id) => {
    const res = await OrderService.getDetailsOrder(id, user?.access_token);
    if (res?.data) {
      setStateOrderDetails({
        info: res?.data.shippingAddress,
        itemsPrice: res?.data.itemsPrice,
        totalPrice: res?.data.totalPrice,
        paymentMethod: res?.data.paymentMethod,
        orderItems: res?.data.orderItems,
        status: res?.data.status,
        createAt: res?.data.createAt,
        paidAt: res?.data.paidAt,
      });
    }

    setIsLoadingUpdate(false);
  };
  const handleOnchangeDetails = (value, option) => {
    setStateOrderDetails({
      ...stateOrderDetails,
      status: value,
    });
  };

  const onUpdateOrder = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        status: stateOrderDetails?.status,
      },
      {
        onSettled: () => {
          queryOrder.refetch();
        },
      }
    );
  };

  useEffect(() => {
    if (rowSelected && isDrawerOpen) {
      setIsLoadingUpdate(true);
      fetchGetDetailsOrder(rowSelected);
    }
  }, [rowSelected, isDrawerOpen]);
  return (
    <div className="mx-5">
        <Row>
        <span className="m-5 text-5xl font-extrabold">
        Quản lý đơn hàng
        </span>
      </Row>
      
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          columns={columns}
          isLoading={isLoadingOrders}
          data={dataTable}
          x={2500}
          y={382}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
        />
      </div>
      <Drawer
        title="Chi tiết đơn hàng"
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        width="80%"
      >
        <LoadingComponent isLoading={isLoadingUpdate}>
          <Form
            name="basic"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 18 }}
            onFinish={onUpdateOrder}
            autoComplete="on"
            form={form}
          >
            <Form.Item label="Đơn hàng">
              <Collapse>
                {stateOrderDetails?.orderItems.map((order, index) => (
                  <Panel header={`Sản phẩm ${index + 1}`} key={index}>
                    <div className="flex items-center">
                      <div className="h-20">
                        <img src={order.image} className="h-full" />
                      </div>
                      <div className="pl-2">
                        <h4>
                          Tên sản phẩm:{" "}
                          <span className="font-medium">{order.name}</span>
                        </h4>
                        <h4>
                          Giá sản phẩm:{" "}
                          <span className="font-medium">{order.price}</span>
                        </h4>
                        <h4>
                          Số lượng sản phẩm:{" "}
                          <span className="font-medium">{order.amount}</span>
                        </h4>
                      </div>
                    </div>
                  </Panel>
                ))}
              </Collapse>
            </Form.Item>

            <Form.Item label="Tên người nhận">
              {/* <span>{stateOrderDetails?.info?.fullName}</span> */}
              <InputComponent
                value={stateOrderDetails?.info?.fullName}
                disabled
              />
            </Form.Item>
            <Form.Item label="Số điện thoại">
              <InputComponent value={stateOrderDetails?.info?.phone} disabled />
            </Form.Item>
            <Form.Item label="Địa chỉ">
              <InputComponent
                value={
                  stateOrderDetails?.info?.street +
                  ", " +
                  stateOrderDetails?.info?.ward +
                  ", " +
                  stateOrderDetails?.info?.district +
                  ", " +
                  stateOrderDetails?.info?.city
                }
                disabled
              />
            </Form.Item>
            <Form.Item label="Phương thức thanh toán">
              <InputComponent
                value={stateOrderDetails?.paymentMethod === "later_money" ? "Trả khi nhận hàng" : "Trả bằng thanh toán paypal"}
                disabled
              />
            </Form.Item>
            <Form.Item label="Giá Sản phẩm">
              <InputComponent value={stateOrderDetails?.itemsPrice} disabled />
            </Form.Item>
            <Form.Item label="Tổng giá (Tiền ship + giá sản phẩm)">
              <InputComponent value={stateOrderDetails?.totalPrice} disabled />
            </Form.Item>
            <Form.Item label="Thời gian giao">
              <InputComponent
                value={
                  stateOrderDetails?.paidAt  ? moment(stateOrderDetails?.paidAt).format('HH:mm DD-MM-YYYY') : "chưa giao hàng"
                }
                disabled
              />
            </Form.Item>

            <Form.Item label="Trạng thái">
              <Select
                value={stateOrderDetails?.status}
                onChange={handleOnchangeDetails}
                options={[
                  {
                    value: "Processing",
                    label: "Đang xử lỷ",
                  },
                  {
                    value: "Delivered",
                    label: "Đã giao",
                  },
                  {
                    value: "Dispatched",
                    label: "Đang giao",
                  },
                  {
                    value: "Cancelled",
                    label: "Đã hủy",
                  },
                ]}
                name="status"
              />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button htmlType="submit">Apply</Button>
            </Form.Item>
          </Form>
        </LoadingComponent>
      </Drawer>
    </div>
  );
};
export default AdminOrder;
