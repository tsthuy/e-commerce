import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Footer from "../Components/Layout/Footer";
import Header from "../Components/Layout/Header";
import ProductDetails from "../Components/Products/ProductDetails";
import SuggestedProduct from "../Components/Products/SuggestedProduct";
import { useSelector } from "react-redux";
import { productData } from "../static/data";

const ProductDetailsPage = () => {
  //   const { allProducts } = useSelector((state) => state.products);
  //   const { allEvents } = useSelector((state) => state.events);
  const { id } = useParams();
  const [data, setData] = useState(null);
  //   const [searchParams] = useSearchParams();
  //   const eventData = searchParams.get("isEvent");

  useEffect(() => {
    // if (eventData !== null) {
    //   const data = allEvents && allEvents.find((i) => i.id === idP);
    //   setData(data);
    // } else {

    const dataSend = productData && productData.find((i) => i.id == id);
    setData(dataSend);
  }, []);

  return (
    <div>
      <Header />
      <ProductDetails data={data} />
      {data && <SuggestedProduct data={data} />}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
