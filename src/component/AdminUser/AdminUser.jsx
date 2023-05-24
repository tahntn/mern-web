import { useQuery } from "@tanstack/react-query";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../service/UserService";
import * as message from "../../component/MessageComponent/MessageComponent";
import { getBase64 } from "../../utils";
import { Drawer, Modal, Row, Select, Upload } from "antd";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { Button, Form, Space } from "antd";
import React from "react";
import InputComponent from "../InputComponent/InputComponent";
import TableComponent from "../TableComponent/TableComponent";
import Moment from "react-moment";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import TextArea from "antd/es/input/TextArea";
const AdminUser = () => {
  const [update, setUpdate] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.auth);
  const searchInput = useRef(null);

  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    isAdmin: false,
    avatar: "",
    street: "",
    ward: "",
    district: "",
    city: "",
    address: "",
  });

  const [form] = Form.useForm();

  const handleUpdate = () => {
    setUpdate(true);
  };

  const mutationUpdate = useMutationHooks((data) => {
    console.log(data);
    const { id, token, city, district, ward, street, ...rests } = data;
    const res = UserService.updateUser(
      id,
      {
        ...rests,
        address_city: city,
        address_district: district,
        address_wards: ward,
        address_street: street,
      },
      token
    );
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    const res = UserService.deleteUser(id, token);
    return res;
  });

  const getAllUsers = async () => {
    const res = await UserService.getAllUser(user?.access_token);
    return res;
  };

  const fetchGetDetailsUser = async (rowSelected, token) => {
    const res = await UserService.getDetailsUser(rowSelected, token);
    if (res?.data) {
      if (
        res?.data?.address_street &&
        res?.data?.address_wards &&
        res?.data?.address_district &&
        res?.data?.address_city
      ) {
        setStateUserDetails({
          name: res?.data?.name,
          email: res?.data?.email,
          phone: res?.data?.phone,
          isAdmin: res?.data?.role,
          street: res?.data?.address_street,
          ward: res?.data?.address_wards,
          district: res?.data?.address_district,
          city: res?.data?.address_city,
          avatar: res.data?.avatar,
          address:
            res?.data?.address_street +
            ", " +
            res?.data?.address_wards +
            ", " +
            res?.data?.address_district +
            ", " +
            res?.data?.address_city,
        });
      } else {
        setStateUserDetails({
          name: res?.data?.name,
          email: res?.data?.email,
          phone: res?.data?.phone,
          isAdmin: res?.data?.role,
          avatar: res.data?.avatar,
        });
      }
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsUser(rowSelected, user?.access_token);
    }
  }, [rowSelected, isOpenDrawer]);

  const handleDetailsProduct = () => {
    setIsOpenDrawer(true);
  };

  const {
    data: dataUpdated,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  const {
    data: dataDeleted,
    isLoading: isLoadingDeleted,
    isSuccess: isSuccessDelected,
    isError: isErrorDeleted,
  } = mutationDeleted;
  // const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDelectedMany, isError: isErrorDeletedMany } = mutationDeletedMany

  const queryUser = useQuery({ queryKey: ["users"], queryFn: getAllUsers });
  const { isLoading: isLoadingUsers, data: users } = queryUser;
  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ fontSize: "20px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <EditOutlined
          style={{ fontSize: "20px", cursor: "pointer" }}
          onClick={handleDetailsProduct}
          className="pl-3"
        />
      </div>
    );
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      // console.log("value", value, record);
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase());
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     // <Highlighter
    //     //   highlightStyle={{
    //     //     backgroundColor: '#ffc069',
    //     //     padding: 0,
    //     //   }}
    //     //   searchWords={[searchText]}
    //     //   autoEscape
    //     //   textToHighlight={text ? text.toString() : ''}
    //     // />
    //   ) : (
    //     text
    //   ),
  });

  const columns = [
    {
      title: "Stt",
      dataIndex: "stt",
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name?.length - b.name?.length,
      ...getColumnSearchProps("name"),
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 250,
      sorter: (a, b) => a.email.length - b.email.length,
      ...getColumnSearchProps("email"),
    },
    {
      title: "Address",
      children: [
        {
          title: "Street",
          dataIndex: "address_street",

          width: 190,
          // sorter: (a, b) => a.age - b.age,
        },
        {
          title: "Ward",
          dataIndex: "address_wards",

          width: 150,
          // sorter: (a, b) => a.age - b.age,
        },
        {
          title: "District",
          dataIndex: "address_district",

          width: 150,
          // sorter: (a, b) => a.age - b.age,
        },
        {
          title: "City",
          dataIndex: "address_city",

          width: 150,
          // sorter: (a, b) => a.age - b.age,
        },
      ],
      // dataIndex: "address",
      // sorter: (a, b) => a.address.length - b.address.length,
      // ...getColumnSearchProps("address"),
    },
    {
      title: "Admin",
      dataIndex: "role",
      width: 100,
      filters: [
        {
          text: "True",
          value: "true",
        },
        {
          text: "False",
          value: "false",
        },
      ],
      onFilter: (value, record) => {
        if (value === "true") {
          return record.role === "true";
        } else if (value === "false") {
          return record.role === "false";
        }
      },
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      width: 150,
      render: (text) => (
        <Moment format="DD-MM-YYYY HH:mm" withTitle>
          {text}
        </Moment>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      width: 150,
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const dataTable =
    users?.data?.length &&
    users?.data?.map((user, index) => {
      return {
        ...user,
        key: user._id,
        // role: user.role === "true" ? "True" : "False",
        stt: index + 1,
      };
    });

  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === "SUCCES") {
      message.success("Xóa thành công");
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error("Lỗi");
    }
  }, [isSuccessDelected]);

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
      avatar: "",
      street: "",
      ward: "",
      district: "",
      city: "",
    });
    form.resetFields();
  };

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "SUCCESS") {
      message.success("Sửa thành công");
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error("Lỗi");
    }
  }, [isSuccessUpdated]);

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteUser = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetails({
      ...stateUserDetails,
      avatar: file.preview,
    });
  };
  const onUpdateUser = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...stateUserDetails },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
    setUpdate(false);
  };

  const [dataCity, setDataCity] = useState([]);
  const [indexCity, setIndexCity] = useState(1);
  const [indexDistrict, setIndexDistrict] = useState(1);

  useEffect(() => {
    const getCity = async () => {
      const req = await axios.get("https://provinces.open-api.vn/api/?depth=3");
      setDataCity(req.data);
    };

    getCity();
  }, []);

  const handleChangeCity = (value) => {
    setIndexCity(value);
    setStateUserDetails({
      ...stateUserDetails,
      city: dataCity[value]?.name,
    });
  };
  const handleChangeDistricts = (value) => {
    setIndexDistrict(value);
    setStateUserDetails({
      ...stateUserDetails,
      district: dataCity[indexCity]?.districts[value].name,
    });
  };
  const handleChangeWard = (value) => {
    setStateUserDetails({
      ...stateUserDetails,
      ward: value,
    });
  };

  return (
    <div className="mx-5">
      <Row>
        <span className="m-5 text-5xl font-extrabold">Quản lý người dùng</span>
      </Row>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          columns={columns}
          isLoading={isLoadingUsers}
          data={dataTable}
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
        title="Chi tiết người dùng"
        open={isOpenDrawer}
        onClose={() => {
          setUpdate(false);
          setIsOpenDrawer(false);
        }}
        width="60%"
      >
        <LoadingComponent isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateUser}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              // rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateUserDetails["name"]}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <InputComponent
                value={stateUserDetails["email"]}
                onChange={handleOnchangeDetails}
                name="email"
                disabled
              />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              // rules={[{ required: true, message: "Please input your  phone!" }]}
            >
              <InputComponent
                value={stateUserDetails["phone"]}
                onChange={handleOnchangeDetails}
                name="phone"
              />
            </Form.Item>
            {!update && (
              <>
                <Form.Item label="Address" name="address">
                  <div className="flex">
                    <TextArea
                      value={stateUserDetails.address}
                      disabled
                      autoSize={{
                        minRows: 2,
                        maxRows: 6,
                      }}
                    />
                    <ButtonComponent
                      textButton="Sửa địa chỉ"
                      onClick={handleUpdate}
                    />
                  </div>
                </Form.Item>
              </>
            )}
            {update && (
              <>
                {/* //city */}
                <div className="flex items-center mb-5">
                  <label
                    htmlFor="city"
                    style={{
                      width: "117px",
                    }}
                    className="flex flex-row-reverse pr-1.5"
                  >
                    Thành phố : {"  "}
                  </label>

                  <Select
                    name="city"
                    onChange={handleChangeCity}
                    style={{
                      width: "87%",
                    }}
                  >
                    {dataCity?.map((item, index) => (
                      <Select.Option key={item.code} value={index}>
                        {item?.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                {/* District */}

                <div className="flex items-center mb-5">
                  <label
                    htmlFor="districts"
                    style={{
                      width: "117px",
                    }}
                    className="flex flex-row-reverse pr-1.5"
                  >
                    Huyện/Quận : {"  "}
                  </label>
                  <Select
                    name="districts"
                    onChange={handleChangeDistricts}
                    style={{
                      width: "87%",
                    }}
                  >
                    {dataCity[indexCity]?.districts?.map((item, index) => (
                      <Select.Option key={item.code} value={index}>
                        {item?.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                {/* ward */}
                <div className="flex items-center mb-5">
                  <label
                    htmlFor="wards"
                    style={{
                      width: "117px",
                    }}
                    className="flex flex-row-reverse pr-1.5"
                  >
                    Phường/Xã : {"  "}
                  </label>

                  <Select
                    name="wards"
                    onChange={handleChangeWard}
                    style={{
                      width: "87%",
                    }}
                  >
                    {dataCity[indexCity]?.districts[indexDistrict]?.wards.map(
                      (item) => (
                        <Select.Option key={item.code} value={item.name}>
                          {item?.name}
                        </Select.Option>
                      )
                    )}
                  </Select>
                </div>
                {/* <div className="flex items-center mb-5"> */}
                <Form.Item label="Street" name="street">
                  <InputComponent
                    value={stateUserDetails.street}
                    onChange={handleOnchangeDetails}
                    name="street"
                  />
                </Form.Item>
                {/* </div> */}
              </>
            )}

            <Form.Item
              label="Avatar"
              name="avatar"
              // rules={[{ required: true, message: "Please input your image!" }]}
            >
              <Upload onChange={handleOnchangeAvatarDetails} maxCount={1}>
                <Button>Select File</Button>
                {stateUserDetails?.avatar && (
                  <img
                    src={stateUserDetails?.avatar}
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginLeft: "10px",
                    }}
                    alt="avatar"
                  />
                )}
              </Upload>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button htmlType="submit">Apply</Button>
            </Form.Item>
          </Form>
        </LoadingComponent>
      </Drawer>
      <Modal
        title="Xóa người dùng"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteUser}
      >
        <LoadingComponent isLoading={isLoadingDeleted}>
          <div>Bạn có chắc xóa tài khoản này không?</div>
        </LoadingComponent>
      </Modal>
    </div>
  );
};

export default AdminUser;
