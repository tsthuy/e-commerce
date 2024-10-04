import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineDelete, AiOutlineMoneyCollect } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { Button, Row, Col, Statistic, Table, Tag } from "antd";
import { MdBorderClear } from "react-icons/md";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import moment from "moment";

const DashBoardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch, seller._id]);
  console.log(orders);
  const availableBalance = seller?.availableBalance.toFixed(2);

  // Grouping the orders by day and calculating total revenue and total orders per day
  useEffect(() => {
    if (orders && orders.length > 0) {
      const revenueByDay = {};
      const ordersByDay = {};

      // Group orders by day and calculate revenue and orders count per day
      orders.forEach((order) => {
        const day = moment(order.createdAt).format("DD MMM YYYY");
        if (!revenueByDay[day]) {
          revenueByDay[day] = 0;
          ordersByDay[day] = 0;
        }
        revenueByDay[day] += order.totalPrice;
        ordersByDay[day] += 1;
      });

      // Get the last 7 days with orders
      const sortedDays = Object.keys(revenueByDay).sort((a, b) => moment(a, "DD MMM YYYY") - moment(b, "DD MMM YYYY"));
      const last7Days = sortedDays.slice(-7);

      const revenueData = last7Days.map((day) => revenueByDay[day]);
      const ordersData = last7Days.map((day) => ordersByDay[day]);

      setChartData({
        labels: last7Days,
        datasets: [
          {
            label: "Revenue (USD)",
            data: revenueData,
            backgroundColor: "#064FF0",
            borderColor: "#064FF0",
            yAxisID: "y-revenue",
          },
          {
            label: "Orders",
            data: ordersData,
            backgroundColor: "#FF3030",
            borderColor: "#FF3030",
            yAxisID: "y-orders",
          },
        ],
      });
    }
  }, [orders]);

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
              <Statistic title="Balance" value={availableBalance} precision={0} />

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
      <h3 className="text-[22px] font-Poppins pb-2">Revenue & Orders Trends</h3>
      <div className="mb-4">
        {/* Line chart displaying revenue and order count per day */}
        <Line
          data={chartData}
          options={{
            scales: {
              y: {
                type: "linear",
                display: false,
                position: "left", // Trục y cho doanh thu (Revenue)

              },
              "y-orders": {
                type: "linear",
                display: true,
                position: "right", // Trục y cho số lượng đơn hàng
                grid: {
                  drawOnChartArea: false, // Ngăn không cho lưới vẽ lên biểu đồ
                },
                ticks: {
                  callback: function (value) {
                    return value; // Hiển thị với đơn vị đơn hàng
                  },
                },
              },
            },
            elements: {
              line: {
                tension: 0.5,
              },
            },
            plugins: {
              title: {
                text: "Monthly Revenue & Orders",
                display: true,
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
          bordered
        />
      </div>
    </div>
  );
};

export default DashBoardHero;
