import React from "react";
import DashboardHeader from "../../Components/Shop/Layout/DashBoardHeader";
import DashboardSideBar from "../../Components/Shop/Layout/DashBoardSideBar";
import AllEvents from "../../Components/Shop/AllEvents.jsx";

const ShopAllEvents = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex justify-between w-full">
        <div className="w-[80px] 800px:w-[330px] border-red-700">
          <DashboardSideBar active={5} />
        </div>
        <div className="w-full  flex flex-col">
          <AllEvents />
        </div>
      </div>
    </div>
  );
};

export default ShopAllEvents;
