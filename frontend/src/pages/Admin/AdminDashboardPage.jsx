import React from "react";
import AdminDashboardMain from "./AdminDashboardMain";
import AdminSideBar from "../../Components/Admin/Layout/AdminSideBar";
import AdminHeader from "../../Components/Admin/Layout/AdminHeader";

const AdminDashboardPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar />
          </div>
          <AdminDashboardMain />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
