import { Button, Drawer, Form, Modal, Row, Space } from "antd";
import * as CategoryService from "../../service/CategoryService";
import { useQuery } from "@tanstack/react-query";
import TableComponent from "../TableComponent/TableComponent";
import { useEffect, useRef, useState } from "react";
import Moment from "react-moment";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import * as message from "../../component/MessageComponent/MessageComponent";

import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import InputComponent from "../InputComponent/InputComponent";
const AdminCategory = () => {
  const [form] = Form.useForm();
  const searchInput = useRef(null);
  const [rowSelected, setRowSelected] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [stateCategory, setStateCategory] = useState({
    name: "",
  });
  const [stateCategoryDetails, setStateCategoryDetails] = useState({
    name: "",
  });

  const getAllCategories = async () => {
    const res = await CategoryService.getAllCategory();
    return res;
  };
  const mutation = useMutationHooks((data) => {
    const res = CategoryService.createCategory(data);
    return res;
  });
  const mutationUpdate = useMutationHooks((data) => {
    const { id,  ...rests } = data;
    const res = CategoryService.updateCategory(id,  { ...rests });
    return res;
  });
  const queryCategories = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });
  const { isLoading: isLoadingCategories, data: categories } = queryCategories;
  const { data, isLoading, isSuccess, isError } = mutation;
  const {
    data: dataUpdated,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  const handleSearch = ( confirm) => {
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
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
  const dataTable =
    categories?.data?.length &&
    categories?.data?.map((category, index) => {
      return {
        ...category,
        key: category._id,
        stt: index + 1,
      };
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
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      width: 200,
      render: (text) => (
        <Moment format="DD-MM-YYYY HH:mm" withTitle>
          {text}
        </Moment>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 100,
      render: renderAction,
    },
  ];
  const handleDetailsProduct = () => {
    setIsOpenDrawer(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateCategory({
      name: "",
    });
    form.resetFields();
  };
  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateCategoryDetails({
      name: "",
    });
    form.resetFields();
  };
  const handleOnchangeDetails = (e) => {
    setStateCategoryDetails({
      ...stateCategoryDetails,
      [e.target.name]: e.target.value,
    });
  };
  const handleOnchange = (e) => {
    setStateCategory((prv) => ({
      ...prv,
      [e.target.name]: e.target.value,
    }));
  };
  const onFinish = () => {
    mutation.mutate(stateCategory, {
      onSettled: () => {
        queryCategories.refetch();
      },
    });
  };
  const fetchGetDetailsCategory = async (rowSelected) => {
    const res = await CategoryService.getDetailsCategory(rowSelected);
    if (res?.data) {
      setStateCategoryDetails({
        name: res?.data?.name,
      });
    }
    setIsLoadingUpdate(false);
  };
  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateCategoryDetails);
    } else {
      form.setFieldsValue({name: ""});
    }
  }, [form, stateCategoryDetails, isModalOpen]);
  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsCategory(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  useEffect(() => {
    if (isSuccess && data?.status === "SUCCES") {
      message.success("Tạo mới thành công");
      handleCancel();
    } else if (isError) {
      message.error("Lỗi");
    }
  }, [isSuccess]); 

  const onFinishUpdate = () => {
    mutationUpdate.mutate({id:rowSelected, ...stateCategoryDetails}, {
        onSettled: () => {
          queryCategories.refetch();
        },
      });
  }

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "SUCCES") {
      message.success("Sửa thành công");
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error("Lỗi");
    }
  }, [isSuccessUpdated]);

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };
  const mutationDeleted = useMutationHooks(({id}) => {
    const res = CategoryService.deleteCategory(id);
    return res;
  });
  const {
    data: dataDeleted,
    isLoading: isLoadingDeleted,
    isSuccess: isSuccessDelected,
    isError: isErrorDeleted,
  } = mutationDeleted;

  const handleDeleteProduct = () => {
    mutationDeleted.mutate(
      { id: rowSelected},
      {
        onSettled: () => {
            queryCategories.refetch();
        },
      }
    );
  }; 
  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === "SUCCES") {
      message.success("Xóa thành công");
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error("Lỗi");
    }
  }, [isSuccessDelected]);
  return (
    <div className="mx-5">
      <Row>
        <span className="m-5 text-5xl font-extrabold">
          Quản lý danh mục sản phẩm
        </span>
      </Row>
      <div style={{ marginTop: "20px" }} className="flex justify-end mr-3">
        <Button
          style={{
            color: "white",
            borderRadius: "6px",
            background: "#00f300",
          }}
          onClick={() => setIsModalOpen(true)}
          className="flex"
        >
          <div className="h-full">
            <PlusCircleOutlined style={{ fontSize: "20px", height: "100%" }} />
          </div>
          <span className="text-white pl-2"> Tạo mới</span>
        </Button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          columns={columns}
          isLoading={isLoadingCategories}
          data={dataTable}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
          y={405}
          x={330}
        />
      </div>
      <Modal
        forceRender
        title="Tạo danh mục sản phẩm"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <LoadingComponent isLoading={isLoading}>
          <Form
            name="basic"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
            // onFinish={onFinish}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateCategory["name"]}
                onChange={handleOnchange}
                name="name"
              />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button htmlType="submit" onClick={onFinish}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </LoadingComponent>
      </Modal>
      <Modal
        forceRender
        footer={null}
        title="Chi tiết danh mục sản phẩm"
        open={isOpenDrawer}
        onCancel={handleCloseDrawer}
      >
        <LoadingComponent isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            // onFinish={onUpdateProduct}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateCategoryDetails["name"]}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button htmlType="submit" onClick={onFinishUpdate}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </LoadingComponent>
      </Modal>

      <Modal
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
      >
        <LoadingComponent isLoading={isLoadingDeleted}>
          <div>Bạn có chắc xóa sản phẩm này không?</div>
        </LoadingComponent>
      </Modal>
    </div>
  );
};

export default AdminCategory;
