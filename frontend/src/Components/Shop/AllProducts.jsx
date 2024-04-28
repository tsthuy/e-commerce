import { Button } from "@material-ui/core";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { deleteProduct } from "../../redux/actions/product";
import Loader from "../Layout/Loader";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    window.location.reload();
  };

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Name", minWidth: 180, flex: 1.4 },
    { field: "price", headerName: "Price", minWidth: 100, flex: 0.6 },
    { field: "Stock", headerName: "Stock", minWidth: 80, flex: 0.5 },
    { field: "sold", headerName: "Sold out", minWidth: 130, flex: 0.6 },
    {
      field: "Preview",
      headerName: "Preview",
      minWidth: 100,
      flex: 0.8,
      renderCell: (params) => (
        <Link to={`/product/${params.data.id}`}>
          <Button>
            <AiOutlineEye size={20} />
          </Button>
        </Link>
      ),
    },
    {
      field: "Delete",
      headerName: "Delete",
      minWidth: 120,
      flex: 0.8,
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.data.id)}>
          <AiOutlineDelete size={20} color="red" />
        </Button>
      ),
    },
  ];

  const row = [];

  products &&
    products.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "US$ " + item.discountPrice,
        Stock: item.stock,
        sold: item?.sold_out,
      });
    });

  return (
    <>
      <AiOutlineEye size={20} color="red" />
      <AiOutlineDelete size={20} />

      {isLoading ? (
        <Loader />
      ) : (
        <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
          {/* <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          /> */}
          <AgGridReact
            rowData={row}
            columnDefs={columns}
            domLayout="autoHeight"
          />
        </div>
      )}
    </>
  );
};

export default AllProducts;
