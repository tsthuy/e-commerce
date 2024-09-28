import React from "react";
import AdminHeader from "../../Components/Admin/Layout/AdminHeader";
import AdminSideBar from "../../Components/Admin/Layout/AdminSideBar";
import AdminAllUsers from "../../Components/Admin/AdminAllUsers";

const AdminDashboardUsers = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={4} />
          </div>
          <AdminAllUsers />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardUsers;
