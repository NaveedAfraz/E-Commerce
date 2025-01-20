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
import React, { useEffect } from "react";
import { authCheck } from "./store/auth-Slice/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";
import UnAuthorized from "./pages/authCheck/unAuthorized";

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
  }, []);

  if (loading) {
    return <Skeleton className="w-[800px] bg-black h-[300px] rounded-full" />;
  }

  return (
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
          <Route path="listings" element={<Listings />} />
          {/* Fixed Account routes */}
          <Route path="account" element={<Account />}></Route>
        </Route>

        {/* Error handling */}
        <Route path="/unauth-page" element={<UnAuthorized />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}
