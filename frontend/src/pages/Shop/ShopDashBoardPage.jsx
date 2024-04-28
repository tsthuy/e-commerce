import React from "react";
import DashBoardHeader from "../../Components/Shop/Layout/DashBoardHeader.jsx";
import DashBoardSideBar from "../../Components/Shop/Layout/DashBoardSideBar.jsx";
function ShopDashBoardPage() {
  return (
    <div>
      <DashBoardHeader />
      <div className="flex items-center justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashBoardSideBar active={1} />
        </div>
      </div>
    </div>
  );
}

export default ShopDashBoardPage;
