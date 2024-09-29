import React, { useEffect, useState } from "react";
import { Button, Select, Space, Table } from "antd";
import { AiOutlineDelete, AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteEvent, getAllEventsShop } from "../../redux/actions/event";
import { getAllProductsShop } from "../../redux/actions/product";
import Loader from "../Layout/Loader";

const AllEvents = () => {
  const { isLoading } = useSelector((state) => state.events);
  const events = useSelector((state) => state.events.events || []); // Ensure products is an array
  const { seller } = useSelector((state) => state.seller);
  const [filterType, setFilterType] = useState("all"); // Holds filter value
  const [searchTerm, setSearchTerm] = useState(""); // Holds search term
  const [filteredData, setFilteredData] = useState([]); // Holds filtered data
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllEventsShop(seller._id));
  }, [dispatch]);
  useEffect(() => {
    let updatedEvents = [...events];
    if (filterType === "FinishDate") {
      updatedEvents = updatedEvents.sort((a, b) => new Date(a.Finish_Date) - new Date(b.Finish_Date));
    } else if (filterType === "SoldOut") {
      updatedEvents = updatedEvents.sort((a, b) => b.sold_out - a.sold_out);
    }
    if (searchTerm) {
      updatedEvents = updatedEvents.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredData(updatedEvents);
  }, [events, searchTerm, filterType]);
  const handleDelete = (id) => {
    dispatch(deleteEvent(id));
    // window.location.reload();
    setFilteredData(filteredData.filter((item) => item._id !== id));
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
  console.log(events);
  const data = filteredData && filteredData.map((item) => ({
    finish_date: new Date(item.Finish_Date).toLocaleDateString(),
    product: item,
    key: item._id,
    id: item._id,
    price: `US$ ${item.discountPrice}`,
    stock: item.stock,
    sold: item.sold_out,
  }));

  return (
    <>
      <div className="py-6 px-3">
        <div className="flex justify-between py-2">

          {/* Filter by Sold Out */}
          <div>
            <Select
              defaultValue="all"
              style={{ width: 200 }}
              onChange={(value) => setFilterType(value)}
            >
              <Select.Option value="AllEvents">All Events</Select.Option>
              <Select.Option value="FinishDate">Finish Date</Select.Option>
              <Select.Option value="SoldOut">Sold Out</Select.Option>
            </Select>
          </div>
          {/* search */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "5px 35px 5px 10px", // Extra padding on the right for the icon
                borderRadius: "4px",
                border: "1px solid #ccc",
                width: "200px", // Adjust the width as needed
              }}
            />
            <AiOutlineSearch
              size={20} // Icon size
              style={{
                position: "absolute",
                right: "10px", // Position it inside the input field
                top: "50%",
                transform: "translateY(-50%)", // Center the icon vertically
                color: "#60A5FA", // Icon color
                cursor: "pointer",
              }}
            />
          </div>
          {/* add new */}
          <div>
            <Link to={"/dashboard-create-event"}>
              <Button type="default" className="bg-blue-400">
                + Add new
              </Button>
            </Link>
          </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="w-full  bg-white">
            <Table
              columns={columns}
              dataSource={data}
              bordered
              pagination={{ pageSize: 10 }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AllEvents;
