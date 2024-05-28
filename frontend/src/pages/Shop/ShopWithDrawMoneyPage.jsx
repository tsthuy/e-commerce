import React from "react";
import WithdrawMoney from "../../Components/Shop/WithdrawMoney.jsx";
import DashBoardHeader from "../../Components/Shop/Layout/DashBoardHeader";
import DashBoardSideBar from "../../Components/Shop/Layout/DashBoardSideBar";

const ShopWithDrawMoneyPage = () => {
  return (
    <div>
      <DashBoardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashBoardSideBar active={7} />
        </div>
        <WithdrawMoney />
      </div>
    </div>
  );
};

export default ShopWithDrawMoneyPage;
