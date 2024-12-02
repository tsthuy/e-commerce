import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Footer from "../Components/Layout/Footer";
import Header from "../Components/Layout/Header";
import ProductDetails from "../Components/Products/ProductDetails";
import SuggestedProduct from "../Components/Products/SuggestedProduct";
import { useSelector } from "react-redux";

const ProductDetailsPage = () => {
  const { allProducts } = useSelector((state) => state.products);
  const { allEvents } = useSelector((state) => state.events);
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");
  useEffect(() => {
    if (eventData !== null) {
      const event = allEvents?.find((i) => i._id === id);
      setData(event);
    } else {
      const product = allProducts?.find((i) => i._id === id);
      setData(product);
    }
  }, [id, allProducts, allEvents, eventData]);  // Add allProducts, allEvents, and eventData as dependencies

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