import React, { useEffect } from "react";
import { Button, Space, Table } from "antd";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteEvent, getAllEventsShop } from "../../redux/actions/event";
import { getAllProductsShop } from "../../redux/actions/product";
import Loader from "../Layout/Loader";

const AllEvents = () => {
  const { events, isLoading } = useSelector((state) => state.events);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllEventsShop(seller._id));
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteEvent(id));
    // window.location.reload();
  };

  const columns = [
    { title: "Event Id", dataIndex: "id", key: "id", width: 150 },
    { title: "Name", dataIndex: "name", key: "name", width: 180 },
    { title: "Price", dataIndex: "price", key: "price", width: 100 },
    { title: "Stock", dataIndex: "stock", key: "stock", width: 80 },
    { title: "Sold out", dataIndex: "sold", key: "sold", width: 130 },
    {
      title: "",
      key: "preview",
      width: 100,
      render: (_, record) => (
        <Link to={`/product/${record.id}?isEvent=true`}>
          <Button icon={<AiOutlineEye />} />
        </Link>
      ),
    },
    {
      title: "",
      key: "delete",
      width: 120,
      render: (_, record) => (
        <Button
          icon={<AiOutlineDelete />}
          onClick={() => handleDelete(record.id)}
          danger
        />
      ),
    },
  ];

  const data = events
    ? events.map((item) => ({
        key: item._id,
        id: item._id,
        name: item.name,
        price: `US$ ${item.discountPrice}`,
        stock: item.stock,
        sold: item.sold_out,
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

export default AllEvents;
