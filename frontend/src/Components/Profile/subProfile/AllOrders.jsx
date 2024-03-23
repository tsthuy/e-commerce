import React from "react";
import { AgGridReact } from "ag-grid-react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { AiOutlineArrowRight } from "react-icons/ai";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const AllOrders = () => {
  const rowData = [
    // ...dữ liệu của bạn
    {
      id: "938467938dhsdf83434",
      itemsQty: 1,
      total: 120,
      status: "Processing",
    },
    // thêm các đơn hàng khác tại đây
  ];

  const columnDefs = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellStyle: (params) =>
        params.value === "Delivered" ? { color: "green" } : { color: "red" },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "action",
      headerName: "",
      minWidth: 150,
      cellRendererFramework: (params) => (
        <Link to={`/user/order/${params.value}`}>
          <Button>
            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        domLayout="autoHeight"
      />
    </div>
  );
};

export default AllOrders;
