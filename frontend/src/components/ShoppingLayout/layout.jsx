import React from "react";
import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "../Home/footer";

function ShoppingLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header>
        <ShoppingHeader />
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default ShoppingLayout;
