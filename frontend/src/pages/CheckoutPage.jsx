import React from "react";
import Header from "../Components/Layout/Header";
import CheckoutSteps from "../Components/Checkout/CheckoutSteps.jsx";
import Footer from "../Components/Layout/Footer";
import Checkout from "../Components/Checkout/Checkout.jsx";

const CheckoutPage = () => {
  return (
    <div>
      <Header />
      <br />
      <br />
      <CheckoutSteps active={1} />
      <Checkout />
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default CheckoutPage;
