import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineDelete, AiOutlineMoneyCollect } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { Button, Row, Col, Statistic, Table, Tag, Select } from "antd";
import { MdBorderClear } from "react-icons/md";
import { Line } from "react-chartjs-2";
import moment from "moment";
import { Option } from "antd/es/mentions";

const DashBoardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [timeRange, setTimeRange] = useState("today");


  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch, seller._id]);
  const availableBalance = seller?.availableBalance;
  useEffect(() => {
    if (orders && orders.length > 0) {
      const now = moment();
      let filteredOrders = [];

      if (timeRange === "today") {
        filteredOrders = orders.filter((order) =>
          moment(order.createdAt).isSame(now, "day")
        );
      } else if (timeRange === "last7days") {
        filteredOrders = orders.filter((order) =>
          moment(order.createdAt).isBetween(
            now.clone().subtract(7, "days"),
            now,
            "day",
            "[]"
          )
        );
      } else if (timeRange === "last30days") {
        filteredOrders = orders.filter((order) =>
          moment(order.createdAt).isBetween(
            now.clone().subtract(30, "days"),
            now,
            "day",
            "[]"
          )
        );
      }

      // Tính tổng doanh thu và số lượng đơn hàng từ `filteredOrders`
      const revenueData = {};
      const ordersCountData = {};

      filteredOrders.forEach((order) => {
        const date = moment(order.createdAt).format("YYYY-MM-DD");
        revenueData[date] = (revenueData[date] || 0) + order.totalPrice;
        ordersCountData[date] = (ordersCountData[date] || 0) + 1;
      });

      const labels = Object.keys(revenueData).sort();
      const revenueValues = labels.map((date) => revenueData[date]);
      const ordersCountValues = labels.map((date) => ordersCountData[date]);

      setChartData({
        labels,
        datasets: [
          {
            label: "Revenue",
            data: revenueValues,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            yAxisID: "y",
          },
          {
            label: "Orders",
            data: ordersCountValues,
            borderColor: "rgba(153, 102, 255, 1)",
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            yAxisID: "y-orders",
          },
        ],
      });
    }
  }, [orders, timeRange]);

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

          <Link to={`/order/${record.id}`}>
            <Button className="border border-blue-500">
              <AiOutlineArrowRight color="blue" size={20} />
            </Button>
          </Link>
        </div>
      ),
    },
  ];


  const data = orders && orders.map((order) => ({
    time: new Date(order.createdAt).toLocaleString(),
    key: order._id,
    name: order.cart[0].name,
    status: order.status,
    itemsQty: order.cart.length,
    total: `US$ ${order.totalPrice}`,
    order,
    id: order._id,
  }));

  const totalRevenue = orders && orders.filter((order) => {
    const now = moment();
    if (timeRange === "today") {
      return moment(order.createdAt).isSame(now, "day");
    } else if (timeRange === "last7days") {
      return moment(order.createdAt).isBetween(
        now.clone().subtract(7, "days"),
        now,
        "day",
        "[]"
      );
    } else if (timeRange === "last30days") {
      return moment(order.createdAt).isBetween(
        now.clone().subtract(30, "days"),
        now,
        "day",
        "[]"
      );
    }
    return false;
  })
    .reduce((sum, order) => sum + order.totalPrice, 0);

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-Poppins pb-2">Overview</h3>
      <Row gutter={16}>
        <Col span={8}>
          <div className="min-h-[20vh] bg-white shadow rounded px-2 py-5">
            <div className="flex items-center">
              <AiOutlineMoneyCollect size={30} className="mr-2" />
              <h3 className="text-[18px] leading-5 font-[400] text-[#00000085]">
                Account Balance{" "}
                <span className="text-[16px]">(with 10% service charge)</span>
              </h3>
            </div>
            <div className="">
              <Statistic title="Balance" value={`US$ ${availableBalance}`} />

            </div>
            <Link to="/dashboard-withdraw-money">
              <h5 className="pt-4 text-[#077f9c]">Withdraw Money</h5>
            </Link>
          </div>
        </Col>
        <Col span={8}>
          <div className="mb-4 min-h-[20vh] bg-white shadow rounded px-2 py-5">
            <div className="flex items-center">
              <MdBorderClear size={30} className="mr-2" />
              <h3 className="text-[18px] leading-5 font-[400] text-[#00000085]">
                All Orders
              </h3>
            </div>
            <Statistic title="Total Orders" value={orders?.length} />
            <Link to="/dashboard-orders">
              <h5 className="pt-4 text-[#077f9c]">View Orders</h5>
            </Link>
          </div>
        </Col>
        <Col span={8}>
          <div className="mb-4 min-h-[20vh] bg-white shadow rounded px-2 py-5">
            <div className="flex items-center">
              <AiOutlineMoneyCollect size={30} className="mr-2" />
              <h3 className="text-[18px] leading-5 font-[400] text-[#00000085]">
                All Products
              </h3>
            </div>
            <Statistic title="Total Products" value={products?.length} />
            <Link to="/dashboard-products">
              <h5 className="pt-4 text-[#077f9c]">View Products</h5>
            </Link>
          </div>
        </Col>
      </Row>
      <br />
      <div>
        <h3 className="text-[22px] font-Poppins pb-2">Revenue & Sales Trends</h3>
        <Select
          defaultValue="today"
          style={{ width: 200, marginBottom: 20 }}
          onChange={(value) => setTimeRange(value)}
        >
          <Option value="today">Today</Option>
          <Option value="last7days">Last 7 Days</Option>
          <Option value="last30days">Last 30 Days</Option>
        </Select>
        <div className="flex justify-between mb-4">
          <Statistic title="Total Revenue" value={`US$ ${totalRevenue && totalRevenue.toFixed(2)}`} />
          <Statistic title="Total Orders" value={chartData.datasets[1]?.data.reduce((a, b) => a + b, 0)} />
        </div>
        <Line
          data={chartData}
          options={{
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Date",
                },
              },
              y: {
                type: "linear",
                position: "left",
                title: {
                  display: true,
                  text: "Revenue (USD)",
                },
              },
              "y-orders": {
                type: "linear",
                position: "right",
                title: {
                  display: true,
                  text: "Number of Orders",
                },
                grid: {
                  drawOnChartArea: false,
                },
              },
            },
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: `Revenue and Orders (${timeRange.replace(/last/, "Last ")})`,
              },
            },
          }}
        />
      </div>

      <h3 className="text-[22px] font-Poppins pb-2">Latest Orders</h3>
      <div className="w-full min-h-[45vh] bg-white rounded">
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
};

export default DashBoardHero;
