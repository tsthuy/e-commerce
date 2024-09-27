import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Button, Select, Input, Tag } from "antd";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { AiOutlineArrowRight, AiOutlineDelete, AiOutlineEdit, AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const AllOrders = () => {
  const { isLoading } = useSelector((state) => state.order);
  const orders = useSelector((state) => state.order.orders || []);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch all orders when component loads
  useEffect(() => {
    if (seller._id) {
      dispatch(getAllOrdersOfShop(seller._id));
    }
  }, [dispatch, seller._id]);

  // Update filtered orders based on search term and filter status
  useEffect(() => {
    let updatedOrders = [...orders];
    
    // Filter based on status
    if (filterStatus === "Processing") {
      updatedOrders = updatedOrders.filter(order => order.status === filterStatus);
    } else if (filterStatus === "Delivered") {
      updatedOrders = updatedOrders.filter(order => order.status === filterStatus);
    }


    // Filter based on search term (name or order ID)
    if (searchTerm) {
      updatedOrders = updatedOrders.filter(order =>
        order.cart[0].name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id.includes(searchTerm)
      );
    }

    setFilteredOrders(updatedOrders);
  }, [orders, searchTerm, filterStatus]);
  const handleDeleteOrder =async (id) => {
    try {
      const response = await axios.delete(`${server}/order/shop/delete-order/${id}`, { withCredentials: true });
      if (response.status === 200) {
      toast.success("Product deleted successfully");
      dispatch(getAllOrdersOfShop(seller._id));
      setFilteredOrders(filteredOrders.filter((order) => order._id !== id));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const columns = [
    {
      title: <div style={{ textAlign: 'center' }}>Name</div>,
      dataIndex: "name",
      key: "name",
      width: 150,
      render: (_, record) => {
        const displayName = record.order.cart[0].name.length > 10 
          ? `${record.order.cart[0].name.substring(0, 10)}...` 
          : record.order.cart[0].name;
        return (
          <div className="flex items-center">
            <img
              src={record.order.cart[0].images[0].url}
              alt={record.order.cart[0].name}
              className="w-10 h-10 object-cover rounded-full"
            />
            <span className="ml-2">{displayName}</span>
          </div>
        );
      },
    },
    {
      title: <div style={{ textAlign: 'center' }}>Time</div>,
      dataIndex: "time",
      key: "time",
      width: 140,
    },
    {
      title: <div style={{ textAlign: 'center' }}>Status</div>,
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (_, record) => (
        <>
        <div className="text-center">
        <Tag className="" color={record.status === "Delivered" ? "green" : "processing"}>
          {record.status.toUpperCase()}
        </Tag>
        </div>
        </>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>Items Quantity</div>,
      dataIndex: "itemsQty",
      key: "itemsQty",
      width: 30,
      render: (text) => <div style={{ textAlign: 'center' }}>{text}</div>,
    },
    {
      title: <div style={{ textAlign: 'center' }}>Total</div>,
      dataIndex: "total",
      key: "total",
      width: 130,
      render: (text) => <div className="text-center font-bold">{text}</div>,
    },
    {
      title: <div style={{ textAlign: 'center' }}>Action</div>,
      key: "action",
      width: 150,
      render: (text, record) => (
        <div className="flex gap-2">
          <Button onClick={() =>handleDeleteOrder(record.id)} className="border border-red-500">
            <AiOutlineDelete className="" danger color="red" size={20} />
          </Button>
        <Link to={`/order/${record.id}`}>
          <Button className="border border-blue-500">
            <AiOutlineArrowRight color="blue" size={20} />
          </Button>
        </Link>
        </div>
      ),
    },
  ];


  const data = filteredOrders.map((order) => ({
    time: new Date(order.createdAt).toLocaleString(),
    key: order._id,
    name: order.cart[0].name,
    status: order.status,
    itemsQty: order.cart.length,
    total: `US$ ${order.totalPrice}`,
    order,
    id: order._id,
  }));

  return (
    <>
      <div className="py-6">
        <div className="flex justify-between py-2">
          {/* Filter by Status */}
          <div>
            <Select
              defaultValue="all"
              style={{ width: 200 }}
              onChange={(value) => setFilterStatus(value)}
            >
              <Select.Option value="all">All Orders</Select.Option>
              <Select.Option value="Processing">Processing</Select.Option>
              <Select.Option value="Delivered">Delivered</Select.Option>
              {/* <Select.Option value="success">Cancelled</Select.Option> */}
            </Select>
          </div>

          {/* Search Orders */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <Input
              placeholder="Search by name or order ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "5px 35px 5px 10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                width: "200px",
              }}
            />
            <AiOutlineSearch
              size={20}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#60A5FA",
                cursor: "pointer",
              }}
            />
          </div>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10 }}
            bordered
            rowClassName={(record, index) =>
              index % 2 === 0 ? "table-row-light" : "table-row-dark"
            }
          />
        )}
      </div>
    </>
  );
};

export default AllOrders;
