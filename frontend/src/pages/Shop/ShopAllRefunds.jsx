import React from "react";

import AllRefundOrders from "../../Components/Shop/AllRefundOrders";
import DashBoardHeader from "../../Components/Shop/Layout/DashBoardHeader";
import DashBoardSideBar from "../../Components/Shop/Layout/DashBoardSideBar";

const ShopAllRefunds = () => {
  return (
    <div>
      <DashBoardHeader />
      <div className="flex justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashBoardSideBar active={10} />
        </div>
        <div className="w-full justify-center flex">
          <AllRefundOrders />
        </div>
      </div>
    </div>
  );
};

export default ShopAllRefunds;
