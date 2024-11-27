import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Table, Button, Tag } from "antd";
import TableData from "../../Common/TableData";
import SearchFilter from "../../utils/SearchFilter";

const AllRefundOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  const [filteredData, setFilteredData] = useState([]); // State to store filtered data

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch, seller]);

  const refundOrders =
    orders &&
    orders.filter(
      (item) =>
        item.status === "Processing refund" || item.status === "Refund Success"
    );

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      width: 150,
      render: (_, record) => {
        console.log(record);
        const displayName =
          record.product.cart[0].name.length > 10
            ? `${record.product.cart[0].name.substring(0, 10)}...`
            : record.product.cart[0].name;
        return (
          <div className="flex items-center">
            <img
              className="w-10 h-10 rounded-lg"
              src={record.product.cart[0].images[0].url}
              alt="product"
            />
            {displayName}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (text, record) => (
        <Tag color={record.status === "Delivered" ? "green" : "processing"}>
          {record.status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Items Qty",
      dataIndex: "itemsQty",
      key: "itemsQty",
      width: 130,
      render: (_, record) => <div>{record.product.cart.length}</div>,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 130,
      render: (_, record) =>


        <div className="font-bold">{record.product.totalPrice}</div>
    },
    {
      title: "",
      key: "action",
      width: 150,
      render: (text, record) => (
        <Link to={`/order/${record.id}`}>
          <Button icon={<AiOutlineArrowRight />} />
        </Link>
      ),
    },
  ];
  console.log(refundOrders);
  const dataMapping = {
    product: (item) => item,
    status: (item) => item.status,
    itemsQty: (item) => item.cart.length,
    total: (item) => item.total,
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          {/* Use SearchFilter */}
          <SearchFilter
            data={refundOrders} // Data to be filtered
            filterKey="status" // Filter by status
            filterOptions={[
              { value: "Processing refund", label: "Processing Refund" },
              { value: "Refund Success", label: "Refund Success" },
            ]}
            searchPaths={["cart[0].name", "cart[0].id"]}// Search by product name or ID
            searchPlaceholder="Search by product or ID"
            setFilteredData={setFilteredData} // Pass filtered data back
          />


          {/* Render the filtered data in the table */}
          <TableData columns={columns} data={refundOrders} loading={isLoading} dataMapping={dataMapping} />
        </div>
      )}
    </>
  );
};

export default AllRefundOrders;