import React, { useEffect, useState } from "react";
import moment from "moment"; // Sử dụng moment thay vì dayjs
import styles from "../../styles/styles";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import Loader from "../../Components/Layout/Loader";
import { Select, Statistic, Table } from "antd";
import { getAllSellers } from "../../redux/actions/seller";
import TableData from "../../Common/TableData";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Option } from "antd/es/mentions";

const AdminDashboardMain = () => {
  const dispatch = useDispatch();

  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );
  const { sellers } = useSelector((state) => state.seller);

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [timeRange, setTimeRange] = useState("today");

  // Lấy dữ liệu đơn hàng và sellers
  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers());
  }, [dispatch]);

  // Lọc và xử lý dữ liệu cho biểu đồ
  useEffect(() => {
    if (adminOrders && adminOrders.length > 0) {
      const now = moment();
      let filteredOrders = [];

      if (timeRange === "today") {
        filteredOrders = adminOrders.filter((order) =>
          moment(order.createdAt).isSame(now, "day")
        );
      } else if (timeRange === "last7days") {
        filteredOrders = adminOrders.filter((order) =>
          moment(order.createdAt).isBetween(
            now.clone().subtract(7, "days"),
            now,
            "day",
            "[]"
          )
        );
      } else if (timeRange === "last30days") {
        filteredOrders = adminOrders.filter((order) =>
          moment(order.createdAt).isBetween(
            now.clone().subtract(30, "days"),
            now,
            "day",
            "[]"
          )
        );
      }

      // Tính tổng doanh thu và số lượng đơn hàng
      const revenueData = {};
      const ordersCountData = {};

      filteredOrders.forEach((order) => {
        const date = moment(order.createdAt).format("YYYY-MM-DD");
        revenueData[date] = (revenueData[date] || 0) + order.totalPrice * 0.1; // Admin nhận 10%
        ordersCountData[date] = (ordersCountData[date] || 0) + 1;
      });

      const labels = Object.keys(revenueData).sort();
      const revenueValues = labels.map((date) => revenueData[date]);
      const ordersCountValues = labels.map((date) => ordersCountData[date]);

      setChartData({
        labels,
        datasets: [
          {
            label: "Admin Revenue (10%)",
            data: revenueValues,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            yAxisID: "y",
          },
          {
            label: "Orders Count",
            data: ordersCountValues,
            borderColor: "rgba(153, 102, 255, 1)",
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            yAxisID: "y-orders",
          },
        ],
      });
    }
  }, [adminOrders, timeRange]);

  // Tổng doanh thu admin
  const filteredAdminOrders =
    adminOrders &&
    adminOrders.filter((order) => {
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
    });

  const adminEarning = filteredAdminOrders && filteredAdminOrders.reduce(
    (acc, item) => acc + item.totalPrice * 0.1,
    0
  );
  const adminEarningAll = adminOrders && adminOrders.reduce(
    (acc, item) => acc + item.totalPrice * 0.1,
    0
  );
  const adminBalance = adminEarning?.toFixed(2);
  const adminBalanceAll = adminEarningAll?.toFixed(2);


  // Cấu hình bảng
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
      width: 130,
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      align: "center",
    },
    {
      title: "Items Quantity",
      dataIndex: "itemsQty",
      key: "itemsQty",
      width: 130,
      align: "center",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 130,
      align: "center",
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 130,
      align: "center",
    },
  ];

  const dataMapping = {
    id: (item) => item._id,
    imageUrl: (item) => item.cart[0]?.images[0]?.url,
    name: (item) => item.cart[0]?.name || "N/A",
    status: (item) => item.status,
    itemsQty: (item) => item.cart.reduce((acc, item) => acc + item.qty, 0),
    total: (item) => `${item.totalPrice} $`,
    createdAt: (item) => moment(item.createdAt).format("YYYY-MM-DD"),
  };

  return (
    <>
      {adminOrderLoading ? (
        <Loader />
      ) : (
        <div className="w-full p-4">
          <h3 className="text-[22px] font-Poppins pb-2">Overview</h3>
          <div className="w-full block 800px:flex items-center justify-between">
            <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
              <div className="flex items-center">
                <AiOutlineMoneyCollect
                  size={30}
                  className="mr-2"
                  fill="#00000085"
                />
                <h3
                  className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
                >
                  Total Earning
                </h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                $ {adminBalanceAll}
              </h5>
            </div>

            <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
              <div className="flex items-center">
                <MdBorderClear size={30} className="mr-2" fill="#00000085" />
                <h3
                  className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
                >
                  All Sellers
                </h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                {sellers && sellers.length}
              </h5>
              <Link to="/admin-sellers">
                <h5 className="pt-4 pl-2 text-[#077f9c]">View Sellers</h5>
              </Link>
            </div>

            <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
              <div className="flex items-center">
                <AiOutlineMoneyCollect
                  size={30}
                  className="mr-2"
                  fill="#00000085"
                />
                <h3
                  className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
                >
                  All Orders
                </h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                {adminOrders && adminOrders.length}
              </h5>
              <Link to="/admin-orders">
                <h5 className="pt-4 pl-2 text-[#077f9c]">View Orders</h5>
              </Link>
            </div>
          </div>

          <br />
          <div className="mb-4">
            <Select
              defaultValue="today"
              style={{ width: 200 }}
              onChange={(value) => setTimeRange(value)}
            >
              <Option value="today">Today</Option>
              <Option value="last7days">Last 7 Days</Option>
              <Option value="last30days">Last 30 Days</Option>
            </Select>
            <div className="flex justify-between mb-4">
              <Statistic title="Total Revenue" value={`US$ ${adminBalance && adminBalance}`} />
              <Statistic title="Total Orders" value={chartData.datasets[1]?.data.reduce((a, b) => a + b, 0)} />
            </div>
          </div>

          <h3 className="text-[22px] font-Poppins pb-2">Latest Orders</h3>

          <div className="w-full min-h-[45vh] bg-white rounded">
            {chartData.labels.length > 0 ? (
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
                      text: `Admin Revenue and Orders (${timeRange.replace(
                        /last/,
                        "Last "
                      )})`,
                    },
                  },
                }}
              />
            ) : (
              <p>No data available for the selected time range.</p>
            )}
          </div>

          <div className="w-full min-h-[45vh] bg-white rounded">
            <TableData
              data={adminOrders}
              dataMapping={dataMapping}
              columns={columns}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboardMain;