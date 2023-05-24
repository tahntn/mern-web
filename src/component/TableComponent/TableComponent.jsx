import { Table } from "antd";
import React, { useState } from "react";
// import Loading from '../../components/LoadingComponent/Loading'
// import { Excel } from "antd-table-saveas-excel";
import { useMemo } from "react";
import LoadingComponent from "../LoadingComponent/LoadingComponent";

const TableComponent = (props) => {
  const { data: dataSource = [], isLoading = false, columns = [], x= 1700, y = 450 } = props;
  // const [rowSelectedKeys, setRowSelectedKeys] = useState([])
  // const newColumnExport = useMemo(() => {
  //   const arr = columns?.filter((col) => col.dataIndex !== 'action')
  //   return arr
  // }, [columns])
  // console.log(dataSource);
  // const rowSelection = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     setRowSelectedKeys(selectedRowKeys)
  //   },
  // getCheckboxProps: (record) => ({
  //   disabled: record.name === 'Disabled User',
  //   // Column configuration not to be checked
  //   name: record.name,
  // }),
  // };
  // const handleDeleteAll = () => {
  //   handleDelteMany(rowSelectedKeys)
  // }
  //   const exportExcel = () => {
  //     const excel = new Excel();
  //     excel
  //       .addSheet("test")
  //       .addColumns(newColumnExport)
  //       .addDataSource(dataSource, {
  //         str2Percent: true
  //       })
  //       .saveAs("Excel.xlsx");
  //   };
  // console.log(x);
  return (
    <LoadingComponent isLoading={isLoading}>
      <Table
        // rowSelection={{
        //   type: selectionType,
        //   ...rowSelection,
        // }}
        columns={columns}
     
        dataSource={dataSource}
        {...props}
        bordered
        scroll={{
          x: x,
          y: y,
        }}
      />
    </LoadingComponent>
  );
};

export default TableComponent;
