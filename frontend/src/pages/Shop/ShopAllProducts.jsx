import React from "react";
import DashboardHeader from "../../Components/Shop/Layout/DashBoardHeader";
import DashboardSideBar from "../../Components/Shop/Layout/DashBoardSideBar";
import AllProducts from "../../Components/Shop/AllProducts.jsx";

const ShopAllProducts = () => {
  return (
    <>
      <DashboardHeader />
    
    <div className="h-screen flex flex-col">

      <div className="flex flex-1 w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={3} />
        </div>
        <div className="flex-grow p-4">
          <AllProducts />
        </div>
      </div>
    </div>
    </>
  );
};

export default ShopAllProducts;
