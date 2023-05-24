import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../service/ProductService";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import { useState, useEffect, useRef } from "react";
import Moment from "react-moment";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { Button, Modal, Row, Space } from "antd";
import { useMutationHooks } from "../../hooks/useMutationHook";
// import * as ProductService from "../../service/ProductService";
import * as message from "../../component/MessageComponent/MessageComponent";
import InputComponent from "../InputComponent/InputComponent";

const AdminReview = () => {
  const searchInput = useRef(null);
  const [rowSelected, setRowSelected] = useState("");
  const [idPro, setIdPro] = useState("")
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const getAllProducts = async () => {
    const res = await ProductService.getAllProducts();
    return res;
  };
  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const mutationDeleted = useMutationHooks((data) => {
    const res = ProductService.removeReviewProduct(data);
    return res;
  });


  const { isLoading: isLoadingProducts, data: products } = queryProduct;
  const {
    data: dataDeleted,
    isLoading: isLoadingDeleted,
    isSuccess: isSuccessDelected,
    isError: isErrorDeleted,
  } = mutationDeleted;
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
      </div>
    );
  };
  let index =1;
  const dataTable =
    products?.data?.length &&
    products?.data.flatMap((p) =>
      p.ratings.map((r) => ({ idProduct: p._id, nameProduct: p.name, ...r,  stt: index++, }))
    );
  const columns = [
    {
      title: "Stt",
      dataIndex: "stt",
      width: 30,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "nameProduct",
      ...getColumnSearchProps("nameProduct"),
      width: 180,
    },
    {
      title: "Tên người đánh giá",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
      width: 150,
    },
    {
      title: "Số sao ",
      dataIndex: "star",
      width: 80,
      render: (text) => (
        <span>{text} sao</span>
      )
    },
    {
      title: "Nội dung đánh giá",
      dataIndex: "reviews",
      ...getColumnSearchProps("reviews"),
      width: 200,
    },
    {
      title: "Thời gian đánh giá",
      dataIndex: "time",
      width: 150,
      render: (text) => 
        (<Moment format="DD-MM-YYYY HH:mm" withTitle>
        {text}
      </Moment>) 
      
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 50,
      render: renderAction,
    },
  ];

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  }; 

  const handleDeleteReview = () => {
   mutationDeleted.mutate({
    idProduct: idPro,
    idReview: rowSelected
   },{
    onSettled: () => {
        queryProduct.refetch();
      },
   })
  }

  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === "SUCCESS") {
      message.success("Xóa thành công");
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error("Lỗi");
    }
  }, [isSuccessDelected]);
  const handleSearch = ( confirm) => {
    confirm();
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };
  

  return (
    <div className="mx-5">
      <Row>
        <span className="m-5 text-5xl font-extrabold">
          Quản lý đánh giá
        </span>
      </Row>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          columns={columns}
            isLoading={isLoadingProducts}
          data={dataTable}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
                setIdPro(record.idProduct)
              },
            };
          }}
        />
      </div>
      <Modal
        title="Xóa đánh giá"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteReview}
      >
        <LoadingComponent 
            isLoading={isLoadingDeleted}
        >
          <div>Bạn có chắc xóa đánh giá này không?</div>
        </LoadingComponent>
      </Modal>
    </div>
  );
};

export default AdminReview;
