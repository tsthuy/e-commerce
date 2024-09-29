import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { server } from "../../server";
import { Table, Button } from "antd";
import TableData from "../../Common/TableData";
import product from "../../redux/reducers/product";
import { toast } from "react-toastify";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    axios
      .get(`${server}/event/admin-all-events`, { withCredentials: true })
      .then((res) => {
        setEvents(res.data.events);
      });
  }, []);
  const handleDelete = (id) => {
    axios
      .delete(`${server}/event/admin/delete/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        setEvents(events.filter((item) => item._id !== id));
      });
  };
  const columns = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
      width: 180,
      render: (_, record) => {
        const displayName = record.product.name.length > 10
          ? `${record.product.name.substring(0, 10)}...`
          : record.product.name;
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={record.product.images[0]?.url}
              alt={record.product.name}
              style={{ width: 50, height: 50, marginRight: 10 }}
              className="rounded-lg"
            />
            {displayName}
          </div>
        );
      },
    },
    {
      title: "Finish_Date", dataIndex: "finish_date", key: "Finish_Date", width: 180,
    },
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
  const dataMapping = {
    finish_date: (item) => new Date(item.Finish_Date).toLocaleDateString(),
    id: (item) => item._id,
    name: (item) => item.name,
    product: (item) => item,
    price: (item) => item.discountPrice,
    stock: (item) => item.stock,
    sold_out: (item) => item.sold_out
  }




  return (
    <div className="w-full mx-8 pt-1 mt-10 bg-white">
      <TableData data={events} dataMapping={dataMapping} columns={columns} />
    </div>
  );
};

export default AllEvents;
