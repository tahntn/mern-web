import { Button, Space, Table, Tooltip, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
// import "./index.scss";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import ButtonComponent from "../../component/ButtonComponent/ButtonComponent";
import InputComponent from "../../component/InputComponent/InputComponent";
import Moment from "react-moment";
import { deleteUser, getAllUsers } from "../../features/auth/authActions";
import  {success as MessSuccess} from "../../component/MessageComponent/MessageComponent";
import { setMessage } from "../../features/auth/authSlice";

const { confirm } = Modal;
const AdminReviewPage = () => {
  const dispatch = useDispatch();
  

  const { allUsers, userToken, loading, messesage } = useSelector((state) => state.auth);
  let   data =
  allUsers &&
  allUsers?.map((user, index) => {
    return { ...user, key: user._id, stt: index };
  });
  const [sortedInfo, setSortedInfo] = useState({});
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [dataFilter, setDataFilter] = useState(data);
  const [search, setSearch] = useState("");

  const columns = [
    {
      title: "Stt",
      dataIndex: "stt",
      key: "stt",
      width: "5%",
      fixed: "left",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      fixed: "left",
      width: 200,
      sorter: (a, b) => a.email.length - b.email.length,
      sortOrder: sortedInfo.columnKey === "email" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: 200,
      sorter: (a, b) => {
        let la, lb;
        if (a?.name?.length === undefined) {
          la = 0;
        } else {
          la = a?.name?.length;
        }
        if (b?.name?.length === undefined) {
          lb = 0;
        } else {
          lb = b?.name?.length;
        }
        return lb - la;
      },
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      width: 90,
      render: (text) => (
        <div className="w-14 h-14 flex items-center justify-center">
          {text ? (
            <img
              src={text}
              alt="avatar user"
              className="w-full h-full rounded-full"
            />
          ) : (
            <div className="w-full h-full">
              <Tooltip title="Không có avatar">
                <UserOutlined
                  style={{
                    fontSize: "30px",
                    border: "1px black solid",
                    borderRadius: "50%",
                    padding: "10px",
                  }}
                />
              </Tooltip>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 120,
      render: (text) => <span>{text ? `0${text}` : ""}</span>,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      // render: (text) =>
    },
    {
      title: "Thời gian tạo tài khoản",
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
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 150,
      render: (text) => (
        <span>{text === "true" ? "Quản trị viên" : "Khách hàng"}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (record) => (<Space size="middle">
          <Tooltip title="Edit">
            <ButtonComponent textButton={<EditOutlined />} />
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
  const handleClickSortEmail = () => {
    setSortedInfo({
      order: "descend",
      columnKey: "email",
    });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
    });
    setSortedInfo(sorter);
  };
  const handleSearch = () => {
    const filteredEvents = data.filter(({ email }) => {
      email = email.toLowerCase();
      return email.includes(search.toLowerCase());
    });
    console.log(filteredEvents);
    setDataFilter(filteredEvents);
  };
  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure delete this task?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        console.log("OK", id);
        dispatch(deleteUser({id, access_token: userToken}));
        data = data.filter(({_id}) => _id !==id )
        setDataFilter(data)
        MessSuccess("Xoa thanh cong")
        dispatch(setMessage)
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  return (
    <div className="admin-user-page">
      <div
        className="flex justify-between items-center "
        style={{ margin: " 0 5px 10px" }}
      >
        <div>
          <ButtonComponent
            textButton={"Sắp xếp Email"}
            onClick={handleClickSortEmail}
          />
          <ButtonComponent
            textButton={"Sắp xếp tên"}
            onClick={handleClickSortName}
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
            placeholder="Tìm kiếm email"
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
        >
          <PlusCircleOutlined style={{ fontSize: "30px", color: "white" }} />
          <span className="text-white ml-1">Tạo mới sản phẩm</span>
        </Button>
      </div>
      <Table
        bordered
        columns={columns}
        onChange={handleTableChange}
        pagination={tableParams.pagination}
        dataSource={dataFilter}
        scroll={{
          x: 1300,
          y: 340,
        }}
      />
    </div>
  );
};
export default AdminReviewPage;
