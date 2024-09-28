import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import AdminHeader from "../../Components/Admin/Layout/AdminHeader";
import AdminSideBar from "../../Components/Admin/Layout/AdminSideBar";
import { Button, Table } from "antd";
import TableDataAntd from "../../Common/TableDataAntd";
import { Link } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import AdminOrderDetails from "../../Components/Admin/AdminOrderDetails";

const AdminDashboardOrders = () => {
  const dispatch = useDispatch();

  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
  }, []);
  const extraColumns = [
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
      width: 130,
      render: (text, record) => <span>{new Date(record.createdAt).toLocaleDateString()}</span>,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
  ];
  const dataMapping = {
    name: (item) => item.cart[0].name,
    imageUrl: (item) => item.cart[0].images[0].url,
    itemsQty: (item) => item.cart.length,
    total: (item) => "US$ " + item.totalPrice,
    status: (item) => item.status,
    createdAt: (item) => new Date(item.createdAt).toLocaleString(),
    order: (item) => item // Chuyển createdAt thành chuỗi thời gian
  };
  const actionRender = (record) => {
    console.log(record);
    return (
      <div className="flex justify-center gap-3">

        <Button onClick={() => { setSelectedOrder(record.order); setOpen(true) }} className="bg-blue-600">Details</Button>

        <Button danger>
          <AiOutlineDelete />
        </Button>
      </div>
    );
  }
  return (
    <>
      <div>
        <AdminHeader />
        <div className="w-full flex">
          <div className="flex items-start justify-between w-full">
            <div className="w-[80px] 800px:w-[330px]">
              <AdminSideBar active={2} />
            </div>

            <div className="w-full flex justify-center pt-5">
              <div className="w-[97%] ">
                <h3 className="text-[22px] font-Poppins pb-2">All Orders</h3>
                <div className="w-full min-h-[45vh] bg-white rounded">
                  <TableDataAntd data={adminOrders} extraColumns={extraColumns} dataMapping={dataMapping} actionRenderer={actionRender} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {open && (<AdminOrderDetails setOpen={setOpen} order={selectedOrder} />)}
    </>
  );
};

export default AdminDashboardOrders;
