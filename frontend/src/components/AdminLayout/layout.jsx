import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";

function AdminLayout() {
  return (
    <div>
      <Sidebar />
      <div>
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
