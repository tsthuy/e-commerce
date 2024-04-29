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
import {
  ShopDashBoardPage,
  ShopCreateProduct,
  ShopAllProducts,
  ShopAllCoupouns,
  ShopCreateEvents,
  ShopAllEvents,
} from "./ShopRoute.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Store from "./redux/store.js";
import { loadUser, loadSeller } from "./redux/actions/user.js";
import SellerProtectedRoute from "./routes/SellerProtectedRoute.jsx";
import ShopHomePage from "./pages/Shop/ShopHomePage.jsx";
import { getAllProducts } from "./redux/actions/product.js";
import { getAllEvents } from "./redux/actions/event.js";
// import { getAllSellers } from "./redux/actions/seller.js";
const App = () => {
  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
    // Store.dispatch(getAllSellers());
    Store.dispatch(getAllEvents());
    Store.dispatch(getAllProducts());
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
          <Route
            path="/dashboard"
            element={
              <SellerProtectedRoute>
                <ShopDashBoardPage />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/shop/:id"
            element={
              <SellerProtectedRoute>
                <ShopHomePage />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard-create-product"
            element={
              <SellerProtectedRoute>
                <ShopCreateProduct />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard-products"
            element={
              <SellerProtectedRoute>
                <ShopAllProducts />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard-coupouns"
            element={
              <SellerProtectedRoute>
                <ShopAllCoupouns />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard-create-event"
            element={
              <SellerProtectedRoute>
                <ShopCreateEvents />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard-events"
            element={
              <SellerProtectedRoute>
                <ShopAllEvents />
              </SellerProtectedRoute>
            }
          />
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
