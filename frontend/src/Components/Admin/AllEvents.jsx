import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { server } from "../../server";
import { Table, Button } from "antd";
const AllEvents = () => {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    axios
      .get(`${server}/event/admin-all-events`, { withCredentials: true })
      .then((res) => {
        setEvents(res.data.events);
      });
  }, []);

  const columns = [
    {
      title: "Product Id",
      dataIndex: "id",
      key: "id",
      width: 150,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 180,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 100,
    },
    {
      title: "Stock",
      dataIndex: "Stock",
      key: "Stock",
      width: 80,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Sold out",
      dataIndex: "sold",
      key: "sold",
      width: 130,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "",
      key: "Preview",
      width: 100,
      render: (record) => (
        <Link to={`/product/${record.id}?isEvent=true`}>
          <Button>
            <AiOutlineEye size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const row = [];

  events &&
    events.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "US$ " + item.discountPrice,
        Stock: item.stock,
        sold: item.sold_out,
      });
    });

  return (
    <div className="w-full mx-8 pt-1 mt-10 bg-white">
      <Table
        dataSource={row}
        columns={columns}
        pagination={{ pageSize: 10 }}
        rowKey="id"
        scroll={{ y: "calc(100vh - 200px)" }} // Adjust height as needed
      />
    </div>
  );
};

export default AllEvents;
