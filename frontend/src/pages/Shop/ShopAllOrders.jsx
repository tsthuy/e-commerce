import React from "react";
import DashboardHeader from "../../Components/Shop/Layout/DashBoardHeader";
import DashboardSideBar from "../../Components/Shop/Layout/DashBoardSideBar";
import AllOrders from "../../Components/Shop/AllOrders.jsx";

const ShopAllOrders = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex flex-col h-screen">
        <div className="flex flex-1">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={2} />
        </div>
        <div className="w-full justify-center flex-grow px-2">
          <AllOrders />
        </div>
        </div>
      </div>
    </div>
  );
};

export default ShopAllOrders;
