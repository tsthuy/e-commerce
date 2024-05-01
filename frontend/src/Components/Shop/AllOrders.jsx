import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Button } from "antd";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { AiOutlineArrowRight } from "react-icons/ai";

const AllOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch, seller._id]);

  const columns = [
    { title: "Order ID", dataIndex: "id", key: "id", width: 150 },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (text) => (
        <span className={text === "Delivered" ? "greenColor" : "redColor"}>
          {text}
        </span>
      ),
    },
    { title: "Items Qty", dataIndex: "itemsQty", key: "itemsQty", width: 130 },
    { title: "Total", dataIndex: "total", key: "total", width: 130 },
    {
      title: "",
      key: "action",
      width: 150,
      render: (text, record) => (
        <Link to={`/order/${record.id}`}>
          <Button>
            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const data = orders
    ? orders.map((item) => ({
        key: item._id,
        id: item._id,
        itemsQty: item.cart.length,
        total: `US$ ${item.totalPrice}`,
        status: item.status,
      }))
    : [];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10 }}
          />
        </div>
      )}
    </>
  );
};

export default AllOrders;
