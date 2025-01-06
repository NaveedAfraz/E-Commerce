import React from "react";
import { Outlet } from "react-router-dom";
import { ShoppingHeader } from "./header";

function ShoppingLayout() {
  return (
    <>
      <div>
        <ShoppingHeader />
      </div>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default ShoppingLayout;
