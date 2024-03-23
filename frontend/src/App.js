import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  LoginPage,
  SignupPage,
  ActivationPage,
  HomePage,
  ProductsPage,
  BestSellingPage,
  FAQPage,
  EventsPage,
  ProductDetailsPage,
  ProfilePage,
  ProtectedRoute,
  ShopCreatePage,
  SellerActivationPage,
  ShopLoginPage,
} from "./Routers.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Store from "./redux/store.js";
import { loadUser, loadSeller } from "./redux/actions/user.js";
// import { getAllSellers } from "./redux/actions/seller.js";
const App = () => {
  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
    // Store.dispatch(getAllSellers());
  }, []);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/sign-up" element={<SignupPage />}></Route>
          <Route path="/products" element={<ProductsPage />}></Route>
          <Route path="/product/:id" element={<ProductDetailsPage />}></Route>
          <Route path="/best-selling" element={<BestSellingPage />}></Route>
          <Route path="/faq" element={<FAQPage />}></Route>
          <Route path="/events" element={<EventsPage />}></Route>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activation/:activation_token"
            element={<ActivationPage />}
          />
          {/* shop */}
          <Route
            path="/seller/activation/:activation_token"
            element={<SellerActivationPage />}
          />
          <Route path="/shop-create" element={<ShopCreatePage />} />
          <Route path="/shop-login" element={<ShopLoginPage />} />
        </Routes>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </BrowserRouter>
    </>
  );
};

export default App;
