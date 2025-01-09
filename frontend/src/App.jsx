// import { Button } from "@/components/ui/button";
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
import Cart from "./pages/shopping/cart";
import Checkout from "./pages/shopping/checkout";
import Listings from "./pages/shopping/listings";
import Account from "./pages/shopping/account";
import AuthCheck from "./components/common/authCheck";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { authCheck } from "./store/auth-Slice/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";

export default function App() {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  // const role = useSelector((state) => state.auth.role);
  const { loading } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  console.log(isAuth, user, location.pathname);
  useEffect(() => {
    dispatch(authCheck()).then((res) => {
      console.log(res);
      if (res?.payload?.message === "Logged in") {
        console.log("logged in successfully");
      }
    });
  }, []);
  console.log(loading, user);
  if (loading) return <Skeleton className="w-[800px] bg-black h-[300px] rounded-full" />;
  return (
    <Router>
      <Routes>
        {/* Auth Routes  */}
        <Route
          path="/"
          element={<AuthCheck isAuthenticated={isAuth} user={user}></AuthCheck>}
        ></Route>
        <Route
          path="/auth"
          element={
            <AuthCheck isAuth={isAuth} user={user}>
              <Layout></Layout>
            </AuthCheck>
          }
        >
          <Route path="login" element={<Login></Login>} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Admin Routes  */}
        <Route
          path="/admin"
          element={
            <AuthCheck isAuth={isAuth} user={user}>
              <AdminLayout></AdminLayout>
            </AuthCheck>
          }
        >
          <Route path="dashboard" element={<Dashboard />}></Route>
          <Route path="product-list" element={<ProductList />}></Route>
          <Route path="orders" element={<Orders />}></Route>
          <Route path="features" element={<Features />}></Route>
        </Route>

        {/* Shopping Routes  */}
        <Route
          path="/shopping"
          element={
            <AuthCheck isAuth={isAuth} user={user}>
              <ShoppingLayout />
            </AuthCheck>
          }
        >
          <Route path="home" element={<Home />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="listings" element={<Listings />} />
          <Route path="account" element={<Account />} /> {/* Add this route */}
        </Route>

        {/* error handling */}
        <Route path="*" element={<h1>404 Not Found</h1>}></Route>
      </Routes>
    </Router>
  );
}
