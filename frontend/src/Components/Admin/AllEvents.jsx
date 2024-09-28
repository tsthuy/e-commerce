import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { server } from "../../server";
import { Table, Button } from "antd";
import TableData from "../../Common/TableData";
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
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 50,
      render: (_, record) => (
        <img
          src={record.imageUrl}
          alt={record.name}
          className="w-[50px] h-[50px] rounded-lg"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 50,
      searchable: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 100,
      searchable: true,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "Stock",
      width: 80,
      searchable: true,
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Sold out",
      dataIndex: "sold_out",
      key: "sold",
      width: 130,
      searchable: true,
      sorter: (a, b) => a.sold_out - b.sold_out,
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
  const dataMapping = {
    id: (item) => item._id,
    imageUrl: (item) => item.images[0].url,
    name: (item) => item.name,
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
