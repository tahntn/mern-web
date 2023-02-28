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
import { useDispatch, useSelector } from "react-redux";
import { UserOutlined, UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import "./index.scss";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import ButtonComponent from "../../component/ButtonComponent/ButtonComponent";
import InputComponent from "../../component/InputComponent/InputComponent";
import Moment from "react-moment";
import {
  deleteUser,
  getAllUsers,
  updateUser,
  userLogin,
  userSignup,
} from "../../features/auth/authActions";
import { success as MessSuccess, error as MessError } from "../../component/MessageComponent/MessageComponent";
import { setMessage } from "../../features/auth/authSlice";
import { getBase64 } from "../../utils";

const { confirm } = Modal;
const AdminUserPage = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { allUsers, userToken, loading,error, messageCRUD } = useSelector(
    (state) => state.auth
  );
  let data =
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

  useEffect(() => {
    data =
      allUsers &&
      allUsers?.map((user, index) => {
        return { ...user, key: user._id, stt: index };
      });
    setDataFilter(data);
  }, [allUsers]);

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
        <div className="column-avatar w-14 h-14 flex items-center justify-center rounded-full border-black border-solid border ">
          {text ? (
            <Image
              src={text}
              alt="avatar user"
              className="w-full h-full rounded-full "
            />
          ) : (
            <div className="w-full h-full">
              <Tooltip title="Không có avatar">
                <UserOutlined
                  style={{
                    fontSize: "33px",
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
      render: (record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <ButtonComponent
              textButton={<EditOutlined />}
              onClick={() => showModalUpdate(record)}
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
    setDataFilter(filteredEvents);
  };
  //delete
  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure delete this task?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        dispatch(deleteUser({ id, access_token: userToken }));
        setIsLoading(true);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  //update
  const [stateUserDetails, setStateUserDetails] = useState({
    _id: "",
    name: "",
    email: "",
    phone: "",
    avatar: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModalUpdate = (id) => {
    console.log(id);
    const { _id, name, email, phone, avatar, address } = id;
    if (_id) {
      setStateUserDetails({ _id, name, email, phone, avatar, address });
    }
    console.log(avatar);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    console.log(stateUserDetails);
    const { _id, ...rests } = stateUserDetails;
    if (_id) {
      dispatch(
        updateUser({ id: _id, data: { ...rests }, access_token: userToken })
      );
    } else {
      dispatch(userSignup({ ...rests }));
    }
    setIsLoading(true);
    setStateUserDetails({
      _id: "",
      name: "",
      email: "",
      phone: "",
      avatar: "",
      address: "",
      password: "",
      confirmPassword: "",
    });
    setIsModalOpen(false);
    setFileList([]);
  };
  const handleCancel = () => {
    setStateUserDetails({
      _id: "",
      name: "",
      email: "",
      phone: "",
      avatar: "",
      address: "",
      password: "",
      confirmPassword: "",
    });
    console.log(stateUserDetails);
    setIsModalOpen(false);
    setFileList([]);
  };
  const handleOnchangeEmail = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      email: e.target.value,
    });
  };
  const handleOnchangeName = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      name: e.target.value,
    });
  };
  const handleOnchangePassword = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      password: e.target.value,
    });
  };
  const handleOnchangeConfirmPassword = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      confirmPassword: e.target.value,
    });
  };
  const handleOnchangePhone = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      phone: e.target.value,
    });
  };
  const handleOnchangeAdress = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      address: e.target.value,
    });
  };
  //upload avatar
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const handleCancelAvatar = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file?.url && !file?.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setFileList(fileList);
    console.log(fileList);
    setStateUserDetails({
      ...stateUserDetails,
      avatar: file.preview,
    });
  };
  const handleRemove = (file) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  return (
    <>
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
            onClick={showModalUpdate}
          >
            <PlusCircleOutlined style={{ fontSize: "30px", color: "white" }} />
            <span className="text-white ml-1">Tạo mới sản phẩm</span>
          </Button>
        </div>
        <Table
          bordered
          columns={columns}
          onChange={handleTableChange}
          loading={isLoading}
          pagination={tableParams.pagination}
          dataSource={dataFilter}
          scroll={{
            x: 1300,
            y: 380,
          }}
        />
      </div>
      <Modal
        title={stateUserDetails._id ? "Cập nhật thông tin người dùng" : "Tạo mới thông tin người dùng"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
      >
        <Row>
          <Col span={16}>
            <div className="flex items-center mb-5">
              <label htmlFor="emai" className="w-32">
                Email
              </label>
              <InputComponent
                id="email"
                value={stateUserDetails.email}
                onChange={handleOnchangeEmail}
                disabled={stateUserDetails._id ? true : false}
              />
            </div>
            {stateUserDetails._id ? undefined : (
              <>
                <div className="flex items-center mb-5">
                  <label htmlFor="password" className="w-32">
                    Mật khẩu
                  </label>
                  <InputComponent
                    id="password"
                    value={stateUserDetails.password}
                    onChange={handleOnchangePassword}
                  />
                </div>
                <div className="flex items-center mb-5">
                  <label htmlFor="confirmPassword" className="w-32">
                    Xác thực mật khẩu
                  </label>
                  <InputComponent
                    id="confirmPassword"
                    value={stateUserDetails.confirmPassword}
                    onChange={handleOnchangeConfirmPassword}
                  />
                </div>
              </>
            )}
            <div className="flex items-center mb-5">
              <label htmlFor="name" className="w-32">
                Tên
              </label>
              <InputComponent
                id="name"
                value={stateUserDetails.name}
                onChange={handleOnchangeName}
              />
            </div>
            <div className="flex items-center mb-5">
              <label htmlFor="phone" className="w-32">
                Số điện thoại
              </label>
              <InputComponent
                id="phone"
                value={stateUserDetails.phone}
                onChange={handleOnchangePhone}
              />
            </div>
            <div className="flex items-center mb-5">
              <label htmlFor="address" className="w-32">
                Địa chỉ
              </label>

              <InputComponent
                id="address"
                value={stateUserDetails.address}
                onChange={handleOnchangeAdress}
              />
            </div>
          </Col>
          <Col span={6} offset={2}>
            {stateUserDetails.avatar ? (
              <>
                <div
                  style={{
                    width: "102px",
                    height: "102px",
                    border: " black 1px solid",
                  }}
                  className="flex items-center"
                >
                  <Image src={stateUserDetails.avatar} alt="avatar" />
                </div>
                <ButtonComponent
                  className="mt-5"
                  textButton={"Xóa avatar"}
                  onClick={() => {
                    setStateUserDetails({
                      ...stateUserDetails,
                      avatar: "",
                    });
                    handleRemove();
                  }}
                />
              </>
            ) : (
              <>
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onRemove={handleRemove}
                  beforeUpload={(file) => {
                    setFileList([...fileList, file]);
                    return false;
                  }}
                  onChange={handleOnchangeAvatar}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
                <Modal
                  open={previewOpen}
                  title={previewTitle}
                  footer={null}
                  onCancel={handleCancelAvatar}
                >
                  <img
                    alt="example"
                    style={{
                      width: "100%",
                    }}
                    src={previewImage}
                  />
                </Modal>
              </>
            )}
          </Col>
        </Row>
      </Modal>
    </>
  );
};
export default AdminUserPage;
