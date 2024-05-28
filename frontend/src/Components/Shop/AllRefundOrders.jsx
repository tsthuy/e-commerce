import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Table, Button } from "antd";
const AllRefundOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

  const refundOrders =
    orders &&
    orders.filter(
      (item) =>
        item.status === "Processing refund" || item.status === "Refund Success"
    );

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (text, record) => (
        <span
          className={record.status === "Delivered" ? "greenColor" : "redColor"}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Items Qty",
      dataIndex: "itemsQty",
      key: "itemsQty",
      width: 130,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 130,
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

  const row = [];

  refundOrders &&
    refundOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <Table
            dataSource={row} // Replace with your data source
            columns={columns}
            pagination={{ pageSize: 10 }} // Set the desired page size
            rowKey="id" // Ensure you have a unique key for each row
          />
        </div>
      )}
    </>
  );
};

export default AllRefundOrders;
