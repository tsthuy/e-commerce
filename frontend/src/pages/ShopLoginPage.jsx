import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ShopLogin from "../Components/Shop/ShopLogin.jsx";

const ShopLoginPage = () => {
  const navigate = useNavigate();
  const { isSeller, isLoading, seller } = useSelector((state) => state.seller);

  useEffect(() => {
    console.log(seller);
    if (isSeller === true) {
      navigate(`/dashboard`);
    }
  }, [isLoading, isSeller]);
  return (
    <div>
      <ShopLogin />
    </div>
  );
};

export default ShopLoginPage;
