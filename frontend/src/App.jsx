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
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes  */}
        <Route path="/auth" element={<Layout></Layout>}>
          <Route path="login" element={<Login></Login>} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Admin Routes  */}
        <Route path="/admin" element={<AdminLayout></AdminLayout>}>
          <Route path="dashboard" element={<Dashboard />}></Route>
          <Route path="product-list" element={<ProductList />}></Route>
          <Route path="orders" element={<Orders />}></Route>
          <Route path="features" element={<Features />}></Route>
        </Route>

        {/* Shopping Routes  */}
        <Route path="/shopping" element={<ShoppingLayout />}>
          
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
