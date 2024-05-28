import React from "react";
import AllSellers from "../../Components/Admin/AllSellers";
import AdminHeader from "../../Components/Admin/Layout/AdminHeader";
import AdminSideBar from "../../Components/Admin/Layout/AdminSideBar";

const AdminDashboardSellers = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={3} />
          </div>
          <AllSellers />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardSellers;
