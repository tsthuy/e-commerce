import React from "react";
import DashBoardHeader from "../../Components/Shop/Layout/DashBoardHeader";
import DashBoardSideBar from "../../Components/Shop/Layout/DashBoardSideBar";
import DashboardMessages from "../../Components/Shop/DashboardMessages.jsx";

const ShopInboxPage = () => {
  return (
    <div>
      <DashBoardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashBoardSideBar active={8} />
        </div>
        <DashboardMessages />
      </div>
    </div>
  );
};

export default ShopInboxPage;
