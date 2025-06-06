import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/authLayout/layout";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import AdminLayout from "./components/AdminLayout/layout";
import Dashboard from "./pages/admin/dashboard";
import ProductList from "./pages/admin/productList";
import Orders from "./pages/admin/orders";
import Features from "./pages/admin/features";
import ShoppingLayout from "./components/ShoppingLayout/layout";
import Home from "./pages/shopping/home";
import Checkout from "./pages/shopping/checkout";
import Listings from "./pages/shopping/listings";
import Account from "./pages/shopping/account";
import AuthCheck from "./components/common/authCheck";
import { useDispatch, useSelector } from "react-redux";
import { Analytics } from "@vercel/analytics/react"
import React, { useEffect } from "react";
import { authCheck } from "./store/auth-Slice/auth-slice";
import { Skeleton } from "@/components/ui/skeleon";
import UnAuthorized from "./pages/authCheck/unAuthorized";
import Paypalreturn from "./pages/shopping/paypal-return";
import PayPalCancel from "./pages/shopping/paypal-cancel";
import PaymentSuccess from "./pages/shopping/payment-sucess";
import ShoppingOrders from "./components/ShoppingLayout/ShoppingOrders";
import { Address } from "./components/ShoppingLayout/address";
import Search from "./pages/shopping/search";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
export default function App() {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const { loading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authCheck()).then((res) => {
      if (res?.payload?.message === "Logged in") {
        console.log("logged in successfully");
      }
    });
  }, [isAuth]);

  if (loading) {
    return (
      <div className="flex h-full my-80 w-full items-center justify-center">
        <FontAwesomeIcon
          icon={faSpinner}
          className="text-gray-500 text-6xl animate-spin"
        />
      </div>
    );
  }


  return (
    <>
      <Analytics />
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route
            path="/"
            element={<AuthCheck isAuthenticated={isAuth} user={user}></AuthCheck>}
          />
          <Route
            path="/auth"
            element={
              <AuthCheck isAuth={isAuth} user={user}>
                <Layout />
              </AuthCheck>
            }
          >
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AuthCheck isAuth={isAuth} user={user}>
                <AdminLayout />
              </AuthCheck>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
            <Route path="features" element={<Features />} />
          </Route>

          {/* Shopping Routes */}
          <Route
            path="/shopping"
            element={
              <AuthCheck isAuth={isAuth} user={user}>
                <ShoppingLayout />
              </AuthCheck>
            }
          >
            <Route path="home" element={<Home />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="search" element={<Search />} />
            <Route path="listings" element={<Listings />} />
            {/* Fixed Account routes */}
            <Route path="account" element={<Account />}>
              <Route path="orders" element={<ShoppingOrders />}></Route>
              <Route path="address" element={<Address />}></Route>
            </Route>
            <Route path="paypal-return" element={<Paypalreturn />} />
            <Route path="paypal-cancel" element={<PayPalCancel />} />
            <Route path="payment-success" element={<PaymentSuccess />}></Route>
          </Route>

          {/* Error handling */}
          <Route path="/unauth-page" element={<UnAuthorized />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Router>
    </>
  );
}
