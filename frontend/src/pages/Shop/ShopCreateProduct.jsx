import React from "react";
import DashBoardHeader from "../../Components/Shop/Layout/DashBoardHeader.jsx";
import DashBoardSideBar from "../../Components/Shop/Layout/DashBoardSideBar";
import CreateProduct from "../../Components/Shop/CreateProduct.jsx";
const ShopCreateProduct = () => {
  return (
    <div>
      <DashBoardHeader />
      <div className="flex items-center justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashBoardSideBar active={4} />
        </div>
        <div className="w-full justify-center flex">
          <CreateProduct />
        </div>
      </div>
    </div>
  );
};

export default ShopCreateProduct;
