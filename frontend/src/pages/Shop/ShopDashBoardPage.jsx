import React from "react";
import DashBoardHeader from "../../Components/Shop/Layout/DashBoardHeader.jsx";
import DashBoardSideBar from "../../Components/Shop/Layout/DashBoardSideBar.jsx";
import DashBoardHero from "../../Components/Shop/DashBoardHero.jsx";
function ShopDashBoardPage() {
  return (
    <div>
      <DashBoardHeader />
      <div className="flex justify-between w-full border-red-500">
        <div className="w-[80px] 800px:w-[330px]">
          <DashBoardSideBar active={1} />
        </div>
        <DashBoardHero />
      </div>
    </div>
  );
}

export default ShopDashBoardPage;
