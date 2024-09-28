import React, { useEffect, useState } from "react";
import moment from "moment"; // Sử dụng moment thay vì dayjs
import styles from "../../styles/styles";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import Loader from "../../Components/Layout/Loader";
import { Table } from "antd";
import { getAllSellers } from "../../redux/actions/seller";
import TableData from "../../Common/TableData";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, defaults } from "chart.js/auto";

const AdminDashboardMain = () => {
  const dispatch = useDispatch();

  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );
  const { sellers } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers());
  }, [dispatch]);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (adminOrders && adminOrders.length > 0) {
      // Nhóm đơn hàng theo ngày (dùng Set để đảm bảo ngày không trùng lặp)
      const ordersByDate = {};
      adminOrders.forEach((order) => {
        const date = moment(order.createdAt).format("YYYY-MM-DD");
        if (!ordersByDate[date]) {
          ordersByDate[date] = [];
        }
        ordersByDate[date].push(order);
      });

      // Lấy 7 ngày gần nhất có đơn hàng
      const last7DaysWithOrders = Object.keys(ordersByDate)
        .sort((a, b) => moment(b).diff(moment(a))) // Sắp xếp theo thứ tự thời gian từ mới đến cũ
        .slice(0, 7); // Chỉ lấy 7 ngày gần nhất

      const totalEarnings = [];
      const ordersCount = [];

      last7DaysWithOrders.forEach((date) => {
        const ordersOfTheDay = ordersByDate[date];

        // Tính tổng doanh thu của ngày
        const totalEarningOfDay = ordersOfTheDay.reduce(
          (acc, order) => acc + order.totalPrice * 0.1,
          0
        );
        totalEarnings.push(totalEarningOfDay.toFixed(2)); // Lợi nhuận mỗi ngày

        ordersCount.push(ordersOfTheDay.length); // Số lượng đơn hàng mỗi ngày
      });

      setChartData({
        labels: last7DaysWithOrders.reverse(), // Đảo ngược để hiển thị từ cũ đến mới
        datasets: [
          {
            label: "Total Earnings ($)",
            data: totalEarnings.reverse(), // Phù hợp với nhãn ngày
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
          },
          {
            label: "Orders Count",
            data: ordersCount.reverse(), // Phù hợp với nhãn ngày
            borderColor: "rgba(153, 102, 255, 1)",
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            borderWidth: 2,
          },
        ],
      });
    }
  }, [adminOrders]);

  const adminEarning =
    adminOrders &&
    adminOrders.reduce((acc, item) => acc + item.totalPrice * 0.1, 0);

  const adminBalance = adminEarning?.toFixed(2);

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
    imageUrl: (item) => item.cart[0].images[0].url,
    name: (item) => item.cart[0].name,
    status: (item) => item.status,
    itemsQty: (item) => item.cart.reduce((acc, item) => acc + item.qty, 0),
    total: (item) => `${item.totalPrice} $`,
    createdAt: (item) => item.createdAt.slice(0, 10),
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
                $ {adminBalance}
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
          <h3 className="text-[22px] font-Poppins pb-2">Latest Orders</h3>

          <div className="w-full min-h-[45vh] bg-white rounded">
            {chartData.labels.length > 0 ? (
              <Line data={chartData} />
            ) : (
              <p>Loading chart data...</p>
            )}
          </div>

          <div className="w-full min-h-[45vh] bg-white rounded">
            <TableData data={adminOrders} dataMapping={dataMapping} columns={columns} />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboardMain;
