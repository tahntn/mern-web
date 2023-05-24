import { Drawer, Form, Modal, Row, Upload } from "antd";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import InputComponent from "../InputComponent/InputComponent";
import TableComponent from "../TableComponent/TableComponent";
import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as ProductService from "../../service/ProductService";
import * as message from "../../component/MessageComponent/MessageComponent";
import { useQuery } from "@tanstack/react-query";
import { Button, Select, Space } from "antd";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { getBase64, renderOptions } from "../../utils";
import TextArea from "antd/es/input/TextArea";

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [imgOne, setImgOne] = useState("");
  const [imgTwo, setImgTwo] = useState("");
  const [imgThree, setImgThree] = useState("");
  const [imgFour, setImgFour] = useState("");
  const [imgFive, setImgFive] = useState("");

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);
  const inittial = () => ({
    name: "",
    price: "",
    description: "",
    gender: "",
    // rating: "",
    image: [],
    type: "",
    quantity: "",
    newType: "",
    // note: "",
  });
  const [stateProduct, setStateProduct] = useState(inittial());
  const [stateProductDetails, setStateProductDetails] = useState(inittial());

  const [form] = Form.useForm();

  const mutation = useMutationHooks((data) => {
    const {
      name,
      price,
      description,
      gender,
      // rating,
      image,
      type,
      quantity,
      // note,
    } = data;
    const res = ProductService.createProduct({
      name,
      price,
      description,
      gender,
      // rating,
      image,
      type,
      quantity,
      // note,
    });
    return res;
  });
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    console.log({...rests});
    const res = ProductService.updateProduct(id, token, { ...rests });
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    const res = ProductService.deleteProduct(id, token);
    return res;
  });

  //   const mutationDeletedMany = useMutationHooks(
  //     (data) => {
  //       const { token, ...ids
  //       } = data
  //       const res = ProductService.deleteManyProduct(
  //         ids,
  //         token)
  //       return res
  //     },
  //   )

  const getAllProducts = async () => {
    const res = await ProductService.getAllProducts();
    return res;
  };

  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected);
    if (res?.data) {
      setStateProductDetails({
        // ...stateProductDetails,
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description,
        gender: res?.data?.gender,
        // rating: res?.data?.rating,
        // image: res?.data?.image,
        type: res?.data?.type,
        quantity: res?.data?.quantity,
        // note: res?.data?.note,
      });
      setImgOne(res?.data?.image[0]);
      setImgTwo(res?.data?.image[1]);
      setImgThree(res?.data?.image[2]);
      setImgFour(res?.data?.image[3]);
      setImgFive(res?.data?.image[4]);
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateProductDetails);
    } else {
      form.setFieldsValue(inittial());
    }
  }, [form, stateProductDetails, isModalOpen]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  const handleDetailsProduct = () => {
    setIsOpenDrawer(true);
  };

  //   const handleDelteManyProducts = (ids) => {
  //     mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
  //       onSettled: () => {
  //         queryProduct.refetch()
  //       }
  //     })
  //   }

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res;
  };

  const { data, isLoading, isSuccess, isError } = mutation;
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
  //   const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDelectedMany, isError: isErrorDeletedMany } = mutationDeletedMany

  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });
  const typeProduct = useQuery({
    queryKey: ["type-product"],
    queryFn: fetchAllTypeProduct,
  });
  // console.log(typeProduct?.data?.data?.name);
  const { isLoading: isLoadingProducts, data: products } = queryProduct;
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
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  }; //ok
  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText('');
  }; //ok

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

  const columns = [
    {
      title: "Stt",
      dataIndex: "stt",
      width: 30,
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      width: 150,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Price",
      dataIndex: "price",
      width: 50,
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: ">= 50",
          value: ">=",
        },
        {
          text: "<= 50",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.price >= 50;
        }
        return record.price <= 50;
      },
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      render: (text) => {return (
        <>
       {text === "female" ? (<span>Nữ</span>) : (<span>Nam</span>)}
        </>
      )
      } ,
      width:60,
      filters: [
        {
          text: "Nam",
          value: "male",
        },
        {
          text: "Nữ",
          value: "female",
        },
      ],
      onFilter: (value, record) => {
        if (value === "male") {
          return record.gender  === "male";
        }
        return record.gender === "female";
      },
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      width: 100,
      render: (text) => {
        return (
          <div className="flex">
            {text.map((item) => (
              <div className="h-10 w-10 mr-1">
                <img
                  src={item}
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
            ))}
          </div>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      width: 50,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      width: 50,
    },
    {
      title: "Đã bán",
      dataIndex: "sold",
      sorter: (a, b) => a.sold - b.sold,
      width: 50,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      width: 150,
    },
    {
      title: "Đánh giá",
      dataIndex: "totalrating",
      width: 40,
      render: (text) => {
        return <span>{text} sao</span>;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 50,
      render: renderAction,
    },
  ];
  const dataTable =
    products?.data?.length &&
    products?.data?.map((product, index) => {
      return { ...product, key: product._id, stt: index + 1 };
    });

  useEffect(() => {
    if (isSuccess && data?.status === "SUCCES") {
      message.success("Tạo mới thành công");
      handleCancel();
    } else if (isError) {
      message.error("Lỗi");
    }
  }, [isSuccess]);

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
    setStateProductDetails({
      name: "",
      price: "",
      description: "",
      gender: "",
      image: [],
      type: "",
      quantity: "",
    });
    setImgOne("");
    setImgFive("");
    setImgTwo("");
    setImgThree("");
    setImgFour("");
    form.resetFields();
  };

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "SUCCES") {
      message.success("Sửa thành công");
      handleCloseDrawer();
    }
    
    else if (isErrorUpdated) {
      message.error("Lỗi");
    }
  }, [isSuccessUpdated]); 

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteProduct = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
    // setIsModalOpenDelete(false); //?? chưa
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: "",
      price: "",
      description: "",
      gender: "",
      // rating: "",
      image: [],
      type: "",
      quantity: "",
      // note: "",
    });
    setImgOne("");
    setImgFive("");
    setImgTwo("");
    setImgThree("");
    setImgFour("");
    form.resetFields();
  }; //chưa ok

  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      gender: stateProduct.gender,
      // rating: stateProduct.rating,
      image: [imgOne, imgTwo, imgThree, imgFour, imgFive],
      type: stateProduct.type,
      quantity: stateProduct.quantity,
      // note: stateProduct.note,
    };

    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  }; //chưa ok
  const handleOnchange = (e) => {
    setStateProduct((prv) => ({
      ...prv,
      [e.target.name]: e.target.value,
    }));
  }; //

  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
  };
  const handleOnChangeSelectDetails = (type,value) => {
    setStateProductDetails({
      ...stateProductDetails,
      [type]: value
    })
  }

  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateProductDetails,
        image: [imgOne, imgTwo, imgThree, imgFour, imgFive],
      },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  }; //chưa ok

  const handleChangeSelect = (type,value) => {
    setStateProduct({
      ...stateProduct,
      [type]: value,
    });
  };

  const handleOnchangeImg1 = (e) => {
    setImgOne(e.target.value);
  };
  const handleOnchangeImg2 = (e) => {
    setImgTwo(e.target.value);
  };
  const handleOnchangeImg3 = (e) => {
    setImgThree(e.target.value);
  };
  const handleOnchangeImg4 = (e) => {
    setImgFour(e.target.value);
  };
  const handleOnchangeImg5 = (e) => {
    setImgFive(e.target.value);
  };
  return (
    <div className="mx-5">
      <Row>
        <span className="m-5 text-5xl font-extrabold">Quản lý sản phẩm</span>
      </Row>
      <div style={{ marginTop: "20px" }} className="flex justify-end mr-3">
        <Button
          style={{
            // height: "50px",
            // width: "150px",
            color: "white",
            borderRadius: "6px",
            background: "#00f300",

            // borderStyle: "dashed",
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
          isLoading={isLoadingProducts}
          data={dataTable}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
          y={405}
        />
      </div>
      <Modal
        forceRender
        title="Tạo sản phẩm"
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
                value={stateProduct["name"]}
                onChange={handleOnchange}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <Select
                name="type"
                // defaultValue="lucy"
                // style={{ width: 120 }}
                value={stateProduct.type}
                onChange={(value) => handleChangeSelect("type",value)}
                options={renderOptions(typeProduct?.data?.data)}
              />
            </Form.Item>

            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[
                { required: true, message: "Please input your quantity!" },
              ]}
            >
              <InputComponent
                value={stateProduct.quantity}
                onChange={handleOnchange}
                name="quantity"
              />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[
                { required: true, message: "Please input your count price!" },
              ]}
            >
              <InputComponent
                value={stateProduct.price}
                onChange={handleOnchange}
                name="price"
              />
            </Form.Item>
            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: "Please input your gender!" }]}
            >
              <Select
                name="gender"
                // defaultValue="lucy"
                // style={{ width: 120 }}
                value={stateProduct.type}
                onChange={(value) => handleChangeSelect("gender",value)}
                options={[
                  {
                    value: 'female',
                    label: 'Nữ',
                  },
                  {
                    value: 'male',
                    label: 'Nam',
                  }]}
              />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input your count description!",
                },
              ]}
            >
              <InputComponent
                value={stateProduct.description}
                onChange={handleOnchange}
                name="description"
              />
            </Form.Item>
            <Form.Item
              label="Image"
              // name="image"
              // rules={[
              //   { required: true, message: "Please input your count image!" },
              // ]}
            >
              <div>
                <InputComponent
                  className="mt-1"
                  value={imgOne}
                  placeholder={"ảnh 1"}
                  onChange={handleOnchangeImg1}
                  // name="description"
                />
                <InputComponent
                  className="mt-1"
                  value={imgTwo}
                  placeholder={"ảnh 2"}
                  onChange={handleOnchangeImg2}
                  // name="description"
                />
                <InputComponent
                  className="mt-1"
                  value={imgThree}
                  placeholder={"ảnh 3"}
                  onChange={handleOnchangeImg3}
                  // name="description"
                />
                <InputComponent
                  className="mt-1"
                  value={imgFour}
                  placeholder={"ảnh 4"}
                  onChange={handleOnchangeImg4}
                  // name="description"
                />
                <InputComponent
                  className="mt-1"
                  value={imgFive}
                  placeholder={"ảnh 5"}
                  onChange={handleOnchangeImg5}
                  // name="description"
                />
              </div>
              {/* <Upload onChange={handleOnchangeAvatar} maxCount={1}>
                <Button>Select File</Button>
                {stateProduct?.image && (
                  <img
                    src={stateProduct?.image}
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
              </Upload> */}
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button htmlType="submit" onClick={onFinish}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </LoadingComponent>
      </Modal>
      <Drawer
        title="Chi tiết sản phẩm"
        open={isOpenDrawer}
        onClose={handleCloseDrawer}
        width="60%"
      >
        <LoadingComponent isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            onFinish={onUpdateProduct}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateProductDetails["name"]}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              
               <Select
                name="type"
                // defaultValue="lucy"
                // style={{ width: 120 }}
                value={stateProductDetails["type"]}
                onChange={(value) => handleOnChangeSelectDetails("type",value)}
                options={renderOptions(typeProduct?.data?.data)}
              />
            </Form.Item>
            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[
                { required: true, message: "Please input your count inStock!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.quantity}
                onChange={handleOnchangeDetails}
                name="quantity"
              />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[
                { required: true, message: "Please input your count price!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.price}
                onChange={handleOnchangeDetails}
                name="price"
              />
            </Form.Item>
            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[
                { required: true, message: "Please input your count price!" },
              ]}
            >
              <Select
                name="gender"
                // defaultValue="lucy"
                // style={{ width: 120 }}
                value={stateProduct.gender}
                onChange={(value) => handleOnChangeSelectDetails("gender", value)}
                options={[
                  {
                    value: 'female',
                    label: 'Nữ',
                  },
                  {
                    value: 'male',
                    label: 'Nam',
                  }]}
              />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input your count description!",
                },
              ]}
            >
              <TextArea
                value={stateProduct.description}
                onChange={handleOnchangeDetails}
                name="description"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>
            {/* <Form.Item
              label="Rating"
              name="rating"
              rules={[
                { required: true, message: "Please input your count rating!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.rating}
                onChange={handleOnchangeDetails}
                name="rating"
              />
            </Form.Item> */}
            {/* <Form.Item
              label="note"
              name="note"
              // rules={[
              //   {
              //     required: true,
              //     message: "Please input your note of product!",
              //   },
              // ]}
            >
              <InputComponent
                value={stateProductDetails.note}
                onChange={handleOnchangeDetails}
                name="note"
              />
            </Form.Item> */}
            <Form.Item
              label="Image"
              // name="image"
              // rules={[
              //   { required: true, message: "Please input your count image!" },
              // ]}
            >
              <div>
                <InputComponent
                  className="mt-1"
                  value={imgOne}
                  placeholder={"ảnh 1"}
                  onChange={handleOnchangeImg1}
                  // name="description"
                />
                <InputComponent
                  className="mt-1"
                  value={imgTwo}
                  placeholder={"ảnh 2"}
                  onChange={handleOnchangeImg2}
                  // name="description"
                />
                <InputComponent
                  className="mt-1"
                  value={imgThree}
                  placeholder={"ảnh 3"}
                  onChange={handleOnchangeImg3}
                  // name="description"
                />
                <InputComponent
                  className="mt-1"
                  value={imgFour}
                  placeholder={"ảnh 4"}
                  onChange={handleOnchangeImg4}
                  // name="description"
                />
                <InputComponent
                  className="mt-1"
                  value={imgFive}
                  placeholder={"ảnh 5"}
                  onChange={handleOnchangeImg5}
                  // name="description"
                />
              </div>

              {/* <Upload onChange={handleOnchangeAvatarDetails} maxCount={1}>
                <Button>Select File</Button>
                {stateProductDetails?.image && (
                  <img
                    src={stateProductDetails?.image}
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
              </Upload> */}
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button htmlType="submit">Apply</Button>
            </Form.Item>
          </Form>
        </LoadingComponent>
      </Drawer>
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

export default AdminProduct;
