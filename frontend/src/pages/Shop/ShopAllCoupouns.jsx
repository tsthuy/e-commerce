import React from "react";
import DashboardHeader from "../../Components/Shop/Layout/DashBoardHeader";
import DashboardSideBar from "../../Components/Shop/Layout/DashBoardSideBar";
import AllCoupons from "../../Components/Shop/AllCoupons.jsx";

const ShopAllCoupouns = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={9} />
        </div>
        <div className="w-full justify-center flex">
          <AllCoupons />
        </div>
      </div>
    </div>
  );
};

export default ShopAllCoupouns;
