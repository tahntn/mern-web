import { Card, Col, Divider, Progress, Row } from "antd";
import ColCardComponent from "../ColCardComponent/ColCardComponent";
import moment from "moment";
import * as UserService from "../../service/UserService";
import * as OrderService from "../../service/OrderService";
import * as ProductService from "../../service/ProductService";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  RiseOutlined,
  CheckCircleOutlined,
  DeliveredProcedureOutlined,
  ShoppingOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { convertPrice } from "../../utils/index.js";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
} from "recharts";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import chart4 from "../../assets/images/bar-chart.png";
import chart1 from "../../assets/images/chart.png";
import chart2 from "../../assets/images/line-graph.png";
import chart3 from "../../assets/images/pie-chart.png";

const AdminStatistical = ({ access_token }) => {
  const [dataProduct, setDataProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [sold, setSold] = useState(0);
  const [dataUser, setDataUser] = useState([]);
  const [userIncreased, setUserIncreased] = useState(0);
  const [percenOfUserIncreased, setPercenOfUserIncreased] = useState(0);
  const [dataOrder, setDataOrder] = useState([]);
  const [percenOfAmountOrderIncreased, setPercenOfAmountOrderIncreased] =
    useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [percenOfTotalPriceIncreased, setPercenOfTotalPriceIncreased] =
    useState(0);
  const [totalReview, setTotalReview] = useState(0);
  const [percenOfTotalReviewIncreased, setPercenOfTotalReviewIncreased] =
    useState(0);
  const [orderStatus, setOrderStatus] = useState({
    Total: 0,
    Cancelled: 0,
    Delivered: 0,
    Processing: 0,
    Dispatched: 0,
  });
  const [userOfWeek, setUserOfWeek] = useState([]);

  const startOfLastMonth = moment()
    .subtract(1, "months")
    .startOf("month")
    .format("YYYY-MM-DD hh:mm:ss");
  const endOfLastMonth = moment()
    .subtract(1, "months")
    .endOf("month")
    .format("YYYY-MM-DD hh:mm:ss");
  const startDate = new Date(startOfLastMonth).getTime();
  const endDate = new Date(endOfLastMonth).getTime();
  const tomorrowDay = moment().add(1, "days");
  const currentDay = tomorrowDay.format("MM/DD/YYYY");
  const week1 = new Date(currentDay).getTime();
  const week2 = new Date(currentDay).getTime() - 7 * 60 * 60 * 24 * 1000;
  const week3 = new Date(currentDay).getTime() - 7 * 60 * 60 * 24 * 1000 * 2;
  const week4 = new Date(currentDay).getTime() - 7 * 60 * 60 * 24 * 1000 * 3;
  const week5 = new Date(currentDay).getTime() - 7 * 60 * 60 * 24 * 1000 * 4;
  const week6 = new Date(currentDay).getTime() - 7 * 60 * 60 * 24 * 1000 * 5;
  const getAllProducts = async () => {
    const res = await ProductService.getAllProducts();
    return res;
  };
  const getAllUsers = async () => {
    const res = await UserService.getAllUser(access_token);
    return res;
  };
  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder();
    return res;
  };
  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });
  const queryUser = useQuery({ queryKey: ["users"], queryFn: getAllUsers });
  const {
    isLoading: isLoadingUsers,
    data: users,
    isSuccess: isSuccessUser,
  } = queryUser;
  const {
    isLoading: isLoadingProducts,
    data: products,
    isSuccess: isSuccessProduct,
  } = queryProduct;
  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrder,
  });
  const {
    isLoading: isLoadingOrders,
    data: orders,
    isSuccess: isSuccessOrder,
  } = queryOrder;

  useEffect(() => {
    if (isSuccessProduct) {
      setDataProduct(products?.data);
    }
  }, [isSuccessProduct]);

  useEffect(() => {
    if (isSuccessUser) {
      setDataUser(users?.data);
    }
  }, [isSuccessUser]);

  useEffect(() => {
    if (isSuccessOrder) {
      setDataOrder(orders?.data);
      console.log(orders);
    }
  }, [isSuccessOrder]);

  useEffect(() => {
    if (dataUser.length > 0) {
      const userInLastMonth = dataUser?.filter((user) => {
        const newCreatedAt = new Date(user?.createdAt).getTime();
        return newCreatedAt >= startDate && newCreatedAt <= endDate;
      });
      const totalUserInLastMonth = dataUser?.filter((user) => {
        const newCreatedAt = new Date(user?.createdAt).getTime();
        return newCreatedAt <= startDate;
      });
      setUserIncreased(userInLastMonth.length);
      setPercenOfUserIncreased(
        Number(
          (userInLastMonth.length / totalUserInLastMonth.length) * 100
        ).toFixed(2)
      );

      const newDataUser1 = dataUser.filter((user) => {
        const newCreatedAt = new Date(user?.createdAt).getTime();
        return newCreatedAt >= week2 && newCreatedAt <= week1;
      });
      // setUserOfWeek([...userOfWeek, {tuan1: newDataUser.length}])
      const newDataUser2 = dataUser.filter((user) => {
        const newCreatedAt = new Date(user?.createdAt).getTime();
        return newCreatedAt >= week3 && newCreatedAt <= week2;
      });
      // setUserOfWeek([...userOfWeek, {tuan2: newDataUser.length}])
      const newDataUser3 = dataUser.filter((user) => {
        const newCreatedAt = new Date(user?.createdAt).getTime();
        return newCreatedAt >= week4 && newCreatedAt <= week3;
      });
      // setUserOfWeek([...userOfWeek, {tuan3: newDataUser.length}])
      const newDataUser4 = dataUser.filter((user) => {
        const newCreatedAt = new Date(user?.createdAt).getTime();
        return newCreatedAt >= week5 && newCreatedAt <= week4;
      });
      const newDataUser5 = dataUser.filter((user) => {
        const newCreatedAt = new Date(user?.createdAt).getTime();
        return newCreatedAt >= week6 && newCreatedAt <= week5;
      });
      // setUserOfWeek([...userOfWeek, {tuan4: newDataUser.length}])
      setUserOfWeek([
        {
          quantity: newDataUser5.length,
          name: moment(week5).format("DD/MM/YYYY"),
        },
        {
          quantity: newDataUser4.length,
          name: moment(week4).format("DD/MM/YYYY"),
        },
        {
          quantity: newDataUser3.length,
          name: moment(week3).format("DD/MM/YYYY"),
        },
        {
          quantity: newDataUser2.length,
          name: moment(week2).format("DD/MM/YYYY"),
        },
        {
          quantity: newDataUser1.length,
          name: moment(week1).format("DD/MM/YYYY"),
        },
      ]);
    }
  }, [dataUser]);

  useEffect(() => {
    if (dataProduct.length > 0) {
      const totalSold = dataProduct.reduce((total, product) => {
        return total + product.sold;
      }, 0);
      setSold(totalSold);
      const totalReview = dataProduct.map((product) => product.ratings).flat();
      setTotalReview(totalReview?.length);
      const totalReviewBeforeLastMonth = totalReview?.filter((review) => {
        const newCreatedAt = new Date(review?.time).getTime();
        return newCreatedAt <= startDate;
      });

      const totalReviewLastMonth = totalReview?.filter((review) => {
        const newCreatedAt = new Date(review?.time).getTime();
        return newCreatedAt >= startDate && newCreatedAt <= endDate;
      });
      if (totalReviewBeforeLastMonth.length === 0) {
        setPercenOfTotalReviewIncreased(100);
      } else {
        setPercenOfTotalReviewIncreased(
          Number(
            (totalReviewLastMonth.length / totalReviewBeforeLastMonth.length) *
              100
          ).toFixed(2)
        );
      }
      const newArr = dataProduct.reduce((accumulator, current) => {
        const existingItemIndex = accumulator.findIndex(
          (item) => item.name === current.type
        );
        if (existingItemIndex >= 0) {
          accumulator[existingItemIndex].quantity++;
        } else {
          accumulator.push({ name: current.type, quantity: 1 });
        }
        return accumulator;
      }, []);
      setCategory(newArr);
    }
  }, [dataProduct]);
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#f50000",
    "#dd0de4",
    "#2ae40d",
    "#e4cf0d",
    "black",
    "#ccc",
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  useEffect(() => {
    if (dataOrder?.length > 0) {
      setOrderStatus({
        ...orderStatus,
        Total: dataOrder.length,
        Processing: dataOrder.filter((order) => order.status === "Processing")
          .length,
        Dispatched: dataOrder.filter((order) => order.status === "Dispatched")
          .length,
        Delivered: dataOrder.filter((order) => order.status === "Delivered")
          .length,
        Cancelled: dataOrder.filter((order) => order.status === "Cancelled")
          .length,
      });
      // console.log(dataOrder.filter(order => order.status === "Processing").length);

      const orderInLastMonth = dataOrder?.filter((order) => {
        const newCreatedAt = new Date(order?.createdAt).getTime();
        return newCreatedAt >= startDate && newCreatedAt <= endDate;
      });
      const totalOrder = dataOrder?.filter((order) => {
        const newCreatedAt = new Date(order?.createdAt).getTime();
        return newCreatedAt <= startDate;
      });

      const orderItemsLastMonth = orderInLastMonth
        .map((order) => order.orderItems)
        .flat();
      const totalAmountLastMonth = orderItemsLastMonth.reduce(
        (acc, cur) => acc + cur.amount,
        0
      );
      const orderItemsTotal = totalOrder
        .map((order) => order.orderItems)
        .flat();
      const totalAmount = orderItemsTotal.reduce(
        (acc, cur) => acc + cur.amount,
        0
      );
      if (totalAmount === 0) {
        setPercenOfAmountOrderIncreased(100);
      } else {
        setPercenOfAmountOrderIncreased(
          Number((totalAmountLastMonth / totalAmount) * 100).toFixed(2)
        );
      }
      //
      const totalPrice = dataOrder.reduce(
        (total, order) => total + order.totalPrice,
        0
      );
      setTotalPrice(totalPrice);
      const totalPriceLastMonth = orderInLastMonth.reduce(
        (total, order) => total + order.totalPrice,
        0
      );
      const totalPriceOrder = totalOrder.reduce(
        (total, order) => total + order.totalPrice,
        0
      );
      if (totalPriceOrder === 0) {
        setPercenOfTotalPriceIncreased(100);
      } else {
        setPercenOfTotalPriceIncreased(
          Number((totalPriceLastMonth / totalPriceOrder) * 100).toFixed(2)
        );
      }

      // setTotalPriceLastMonth(totalPriceLastMonth)
    }
  }, [dataOrder]);

  return (
    <div
      className="sm:overflow-hidden overflow-scroll"
    >

      <div
        className="xs:max-h-[calc(100vh-80px)] sm:pb-0px sm:max-h-full xs:min-w-[500px]   "
      >
        <LoadingComponent
          isLoading={isLoadingProducts || isLoadingUsers || isLoadingOrders}
        >
          <Row>
            <span className="m-5 text-5xl font-extrabold">
              Quản lý thống kê
            </span>
          </Row>

          <Row>
            {access_token !== null && (
              <Col xl={12} xs={24} sm={24}>
                <Row className="bg-white p-5 m-3 rounded-2xl flex items-center">
                  <Col span={19}>
                    <h2
                      className="text-2xl font-semibold"
                      style={{
                        color: "#74788d",
                      }}
                    >
                      Tổng số người dùng
                    </h2>
                    <h1 className="text-4xl font-extrabold">
                      {dataUser.length}
                    </h1>
                    <div className="pt-2">
                      <div className="flex items-center">
                        <div
                          style={{
                            border: "2px solid #05c3fb",
                            borderRadius: "50%",
                            padding: "2px",
                          }}
                          className="h-7 w-7 flex items-center justify-center"
                        >
                          <RiseOutlined
                            className="text-base"
                            style={{
                              color: "#05c3fb",
                            }}
                          />
                        </div>
                        <span className="text-lg pl-2">
                          Tăng{" "}
                          <span
                            style={{
                              color: "#05c3fb",
                            }}
                          >
                            5%
                          </span>{" "}
                          so với Tuần trước
                        </span>
                      </div>
                      <div className="flex items-center mt-2">
                        <div
                          style={{
                            border: "2px solid #05c3fb",
                            borderRadius: "50%",
                            padding: "2px",
                          }}
                          className="h-7 w-7 flex items-center justify-center"
                        >
                          <RiseOutlined
                            className="text-base"
                            style={{
                              color: "#05c3fb",
                            }}
                          />
                        </div>
                        <span className="text-lg pl-2">
                          Tăng{" "}
                          <span
                            style={{
                              color: "#05c3fb",
                            }}
                          >
                            {percenOfUserIncreased}%
                          </span>{" "}
                          so với Tháng trước
                        </span>
                      </div>
                    </div>
                  </Col>
                  <Col span={5}>
                    <div>
                      <img src={chart4} className="w-full" />
                    </div>
                  </Col>
                </Row>
              </Col>
            )}
            <Col xl={12} xs={24} sm={24}>
              <Row className="bg-white p-5 m-3 rounded-2xl flex items-center">
                <Col span={19}>
                  <h2
                    className="text-2xl font-semibold"
                    style={{
                      color: "#74788d",
                    }}
                  >
                    Tổng số sản phẩm đã bán
                  </h2>
                  <h1 className="text-4xl font-extrabold">{sold}</h1>
                  <div className="pt-2">
                    <div className="flex items-center">
                      <div
                        style={{
                          border: "2px solid #ec82ef",
                          borderRadius: "50%",
                          padding: "2px",
                        }}
                        className="h-7 w-7 flex items-center justify-center"
                      >
                        <RiseOutlined
                          className="text-base"
                          style={{
                            color: "#ec82ef",
                          }}
                        />
                      </div>
                      <span className="text-lg pl-2">
                        Tăng{" "}
                        <span
                          style={{
                            color: "#ec82ef",
                          }}
                        >
                          5%
                        </span>{" "}
                        so với Tuần trước
                      </span>
                    </div>
                    <div className="flex items-center mt-2">
                      <div
                        style={{
                          border: "2px solid #ec82ef",
                          borderRadius: "50%",
                          padding: "2px",
                        }}
                        className="h-7 w-7 flex items-center justify-center"
                      >
                        <RiseOutlined
                          className="text-base"
                          style={{
                            color: "#ec82ef",
                          }}
                        />
                      </div>
                      <span className="text-lg pl-2">
                        Tăng{" "}
                        <span
                          style={{
                            color: "#ec82ef",
                          }}
                        >
                          {percenOfAmountOrderIncreased}%
                        </span>{" "}
                        so với Tháng trước
                      </span>
                    </div>
                  </div>
                </Col>
                <Col span={5}>
                  <div>
                    <img src={chart1} className="w-full" />
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xl={12} xs={24} sm={24}>
              <Row className="bg-white p-5 m-3 rounded-2xl flex items-center">
                <Col span={19}>
                  <h2
                    className="text-2xl font-semibold"
                    style={{
                      color: "#74788d",
                    }}
                  >
                    Tổng số tiền đơn hàng
                  </h2>
                  <h1 className="text-4xl font-extrabold">
                    {convertPrice(totalPrice)}
                  </h1>
                  <div className="pt-2">
                    <div className="flex items-center">
                      <div
                        style={{
                          border: "2px solid #4ecc48",
                          borderRadius: "50%",
                          padding: "2px",
                        }}
                        className="h-7 w-7 flex items-center justify-center"
                      >
                        <RiseOutlined
                          className="text-base"
                          style={{
                            color: "#4ecc48",
                          }}
                        />
                      </div>
                      <span className="text-lg pl-2">
                        Tăng{" "}
                        <span
                          style={{
                            color: "#4ecc48",
                          }}
                        >
                          5%
                        </span>{" "}
                        so với Tuần trước
                      </span>
                    </div>
                    <div className="flex items-center mt-2">
                      <div
                        style={{
                          border: "2px solid #4ecc48",
                          borderRadius: "50%",
                          padding: "2px",
                        }}
                        className="h-7 w-7 flex items-center justify-center"
                      >
                        <RiseOutlined
                          className="text-base"
                          style={{
                            color: "#4ecc48",
                          }}
                        />
                      </div>
                      <span className="text-lg pl-2">
                        Tăng{" "}
                        <span
                          style={{
                            color: "#4ecc48",
                          }}
                        >
                          {percenOfTotalPriceIncreased}%
                        </span>{" "}
                        so với Tháng trước
                      </span>
                    </div>
                  </div>
                </Col>
                <Col span={5}>
                  <div>
                    <img src={chart2} className="w-full" />
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xl={12} xs={24} sm={24}>
              <Row className="bg-white p-5 m-3 rounded-2xl flex items-center">
                <Col span={19}>
                  <h2
                    className="text-2xl font-semibold"
                    style={{
                      color: "#74788d",
                    }}
                  >
                    Số bình luận trong tháng trước
                  </h2>
                  <h1 className="text-4xl font-extrabold">{totalReview}</h1>
                  <div className="pt-2">
                    <div className="flex items-center">
                      <div
                        style={{
                          border: "2px solid #f7b731",
                          borderRadius: "50%",
                          padding: "2px",
                        }}
                        className="h-7 w-7 flex items-center justify-center"
                      >
                        <RiseOutlined
                          className="text-base"
                          style={{
                            color: "#f7b731",
                          }}
                        />
                      </div>
                      <span className="text-lg pl-2">
                        Tăng{" "}
                        <span
                          style={{
                            color: "#f7b731",
                          }}
                        >
                          5%
                        </span>{" "}
                        so với Tuần trước
                      </span>
                    </div>
                    <div className="flex items-center mt-2">
                      <div
                        style={{
                          border: "2px solid #f7b731",
                          borderRadius: "50%",
                          padding: "2px",
                        }}
                        className="h-7 w-7 flex items-center justify-center"
                      >
                        <RiseOutlined
                          className="text-base"
                          style={{
                            color: "#f7b731",
                          }}
                        />
                      </div>
                      <span className="text-lg pl-2">
                        Tăng{" "}
                        <span
                          style={{
                            color: "#f7b731",
                          }}
                        >
                          {percenOfTotalReviewIncreased}%
                        </span>{" "}
                        so với Tháng trước
                      </span>
                    </div>
                  </div>
                </Col>
                <Col span={5}>
                  <div>
                    <img src={chart3} className="w-full" />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col xl={16} sm={24} xs={24}>
              <div className="bg-white p-5 m-3 rounded-2xl ">
                <h1 className="text-xl  font-medium">Phân tích sản phẩm</h1>
                <Divider />
                <ResponsiveContainer width="100%" height={440}>
                  <BarChart
                    width={500}
                    height={300}
                    data={dataProduct}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantity" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="sold" stackId="a" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Col>
            <Col xl={8} sm={24} xs={24}>
              <Row className="bg-white p-5 m-3 rounded-2xl flex flex-col">
                <h1 className="text-xl  font-medium">
                  Trạng thái các đơn hàng
                </h1>
                <Row className="flex items-center ">
                  <Col className="bg-gray-100 flex items-center justify-center rounded-full h-10 w-10">
                    <CheckCircleOutlined
                      className="text-xl "
                      style={{
                        color: "#0bb197",
                      }}
                    />
                  </Col>
                  <Col span={20} className="pl-2">
                    <h2>Đã giao</h2>
                    <div>
                      <Progress
                        percent={
                          Number(orderStatus.Delivered / orderStatus.Total) *
                          100
                        }
                        showInfo={false}
                      />
                    </div>
                  </Col>
                </Row>
                <Row className="flex items-center">
                  <Col className="bg-gray-100 flex items-center justify-center rounded-full h-10 w-10">
                    <ShoppingOutlined
                      className="text-xl "
                      style={{
                        color: "#0bb197",
                      }}
                    />
                  </Col>
                  <Col span={20} className="pl-2">
                    <h2>Đang giao</h2>
                    <div>
                      <Progress
                        percent={
                          Number(orderStatus.Dispatched / orderStatus.Total) *
                          100
                        }
                        showInfo={false}
                        strokeColor="rgb(82, 196, 26)"
                      />
                    </div>
                  </Col>
                </Row>
                <Row className="flex items-center">
                  <Col className="bg-gray-100 flex items-center justify-center rounded-full h-10 w-10">
                    <DeliveredProcedureOutlined
                      className="text-xl "
                      style={{
                        color: "#0bb197",
                      }}
                    />
                  </Col>
                  <Col span={20} className="pl-2">
                    <h2>Đang xử lý</h2>
                    <div>
                      <Progress
                        percent={
                          Number(orderStatus.Processing / orderStatus.Total) *
                          100
                        }
                        showInfo={false}
                        strokeColor="rgb(252,185,44)"
                      />
                    </div>
                  </Col>
                </Row>
                <Row className="flex items-center">
                  <Col className="bg-gray-100 flex items-center justify-center rounded-full h-10 w-10">
                    <CloseCircleOutlined
                      className="text-xl "
                      style={{
                        color: "#0bb197",
                      }}
                    />
                  </Col>
                  <Col span={20} className="pl-2">
                    <h2>Đã hủy</h2>
                    <div>
                      <Progress
                        percent={
                          Number(orderStatus.Cancelled / orderStatus.Total) *
                          100
                        }
                        showInfo={false}
                        strokeColor="rgb(255,61,96)"
                      />
                    </div>
                  </Col>
                </Row>
                <Divider />
                <Row gutter={[16, 24]}>
                  <Col span={6} className="flex flex-col items-center">
                    <h1 className="text-gray-500 text-base">Đã giao</h1>
                    <h2>{orderStatus.Delivered}</h2>
                  </Col>
                  <Col span={6} className="flex flex-col items-center">
                    <h1 className="text-gray-500 text-base">Đang giao</h1>
                    <h2>{orderStatus.Dispatched}</h2>
                  </Col>
                  <Col span={6} className="flex flex-col items-center">
                    <h1 className="text-gray-500 text-base">Đã xử lý</h1>
                    <h2>{orderStatus.Processing}</h2>
                  </Col>
                  <Col span={6} className="flex flex-col items-center">
                    <h1 className="text-gray-500 text-base">Đã hủy</h1>
                    <h2>{orderStatus.Cancelled}</h2>
                  </Col>
                </Row>
                {/* <ShoppingOutlined />
              <DeliveredProcedureOutlined />
              <CloseCircleOutlined /> */}
              </Row>
            </Col>
            {category.length > 0 && (
              <Col xl={8} sm={24} xs={24}>
                <div className="m-3 bg-white p-5  rounded-2xl">
                  <h1 className="text-xl  font-medium">
                    Phân tích danh mục sản phẩm
                  </h1>
                  <Divider />
                  {/* <ResponsiveContainer width={300} height={440}> */}
                  <PieChart width={400} height={400}>
                    <Pie
                      data={category}
                      cx={100}
                      cy={100}
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="quantity"
                      legendType="square"
                    >
                      {category.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend
                      iconSize={10}
                      layout="radial"
                      verticalAlign="bottom"
                    />
                  </PieChart>
                  {/* </ResponsiveContainer> */}
                </div>
              </Col>
            )}
            <Col xl={16} sm={24} xs={24} className=" ">
              <div className="m-3 bg-white p-5  rounded-2xl">
                <h1 className="text-xl  font-medium">
                  Phân tích người dùng theo từng tuần
                </h1>
                <Divider />
                <ResponsiveContainer width="100%" height={440}>
                  <AreaChart
                    width={500}
                    height={400}
                    data={userOfWeek}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="quantity"
                      stroke="#8884d8"
                      fill="#8884d8"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Col>
          </Row>
        </LoadingComponent>
      </div>
    </div>
  );
};


export default AdminStatistical;
