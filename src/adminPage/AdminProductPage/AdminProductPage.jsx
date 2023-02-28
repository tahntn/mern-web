import {
  Button,
  Space,
  Table,
  Tooltip,
  Modal,
  Upload,
  Image,
  Row,
  Col,
} from "antd";

import {
  UserOutlined,
  UploadOutlined,
  PlusOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "../../component/ButtonComponent/ButtonComponent";
import InputComponent from "../../component/InputComponent/InputComponent";
import { success as MessSuccess, error as MessError } from "../../component/MessageComponent/MessageComponent";
import Moment from "react-moment";
import { getBase64 } from "../../utils";
import { deleteProduct } from "../../features/product/productAction";
import { setMessage } from "../../features/product/productSlice";

const { confirm } = Modal;

const AdminProductPage = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { allProducts, messageCRUD, error } = useSelector((state) => state.product);
  const [sortedInfo, setSortedInfo] = useState({});
  const [search, setSearch] = useState("");

  const [datatableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  let data =
    allProducts &&
    allProducts?.map((product, index) => {
      return { ...product, key: product._id, stt: index };
    });
  const [dataFilter, setDataFilter] = useState(data);
  useEffect(() => {
    data =
      allProducts &&
      allProducts?.map((product, index) => {
        return { ...product, key: product._id, stt: index };
      });
    setDataFilter(data);
  }, [allProducts]);

  useEffect(() => {
    if (messageCRUD) {
      setIsLoading(false);
      if(error){
        MessError(messageCRUD)
      } else {
        
        MessSuccess(messageCRUD);
      }
      dispatch(setMessage());
    }
  }, [data]);
  const columns = [
    {
      title: "Stt",
      dataIndex: "stt",
      key: "stt",
      width: 60,
      fixed: "left",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 200,
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 80,
      sorter: (a, b) => b.price - a.price,
      sortOrder: sortedInfo.columnKey === "price" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 200,
    },
    {
      title: "Ảnh",
      dataIndex: "images",
      key: "images",
      width: 300,
    },
    {
      title: "Danh mục sản phẩm",
      dataIndex: "type",
      key: "type",
      width: 200,
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Reviews",
      dataIndex: "ratings",
      key: "ratings",
    },
    {
      title: "Số lượng bán",
      dataIndex: "sold",
      key: "sold",
      width: 140,
      sorter: (a, b) => b.sold - a.sold,
      sortOrder: sortedInfo.columnKey === "sold" ? sortedInfo.order : null,
    },
    {
      title: "Số lượng trong kho",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => b.quantity - a.quantity,
      sortOrder: sortedInfo.columnKey === "quantity" ? sortedInfo.order : null,
    },
    {
      title: "Thời gian tạo sản phẩm",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      render: (text) => (
        <Moment format="DD/MM/YYYY" withTitle>
          {text}
        </Moment>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <ButtonComponent
              textButton={<EditOutlined />}
              // onClick={() => showModalUpdate(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <ButtonComponent
              textButton={<DeleteOutlined />}
              onClick={() => showDeleteConfirm(record?._id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleClickSortName = () => {
    setSortedInfo({
      order: "ascend",
      columnKey: "name",
    });
  };
  const handleClickSortPrice = () => {
    setSortedInfo({
      order: "ascend",
      columnKey: "price",
    });
  };

  const handleSearch = () => {
    const filteredEvents = data.filter(({ name }) => {
      name = name.toLowerCase();
      return name.includes(search.toLowerCase());
    });
    setDataFilter(filteredEvents);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
    });
    setSortedInfo(sorter);
  };

  // delete
  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure delete this task?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        console.log("id", id);
        dispatch(deleteProduct({ id}));
        setIsLoading(true);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <>
      <div>
        <div
          className="flex justify-between items-center "
          style={{ margin: " 0 5px 10px" }}
        >
          <div>
            <ButtonComponent
              textButton={"Sắp xếp tên sản phẩm"}
              onClick={handleClickSortName}
            />
            <ButtonComponent
              textButton={"Sắp xếp giá"}
              onClick={handleClickSortPrice}
              className="ml-1"
            />

            <ButtonComponent
              textButton={"Hoàn tác dữ liệu"}
              onClick={() => {
                setSearch("");
                setDataFilter(data);
              }}
              className="ml-1"
            />
          </div>
          <div className="flex">
            <InputComponent
              placeholder="Tìm kiếm sản phẩm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-black"
            />
            <ButtonComponent textButton={"Tìm kiếm"} onClick={handleSearch} />
          </div>
          <Button
            style={{
              padding: "8px",
              boder: "1px black solid",
              background: "#00c309",
              borderRadius: "10px",
              height: "100%",
            }}
            // onClick={showModalUpdate}
          >
            <PlusCircleOutlined style={{ fontSize: "30px", color: "white" }} />
            <span className="text-white ml-1">Tạo mới sản phẩm</span>
          </Button>
        </div>
        <Table
          bordered
          columns={columns}
          dataSource={dataFilter}
          loading={isLoading}
          onChange={handleTableChange}
          scroll={{
            x: 2500,
            y: 350,
          }}
        />
      </div>
    </>
  );
};
export default AdminProductPage;
