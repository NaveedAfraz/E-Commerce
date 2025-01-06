import React from "react";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 h-full bg-black text-white flex items-center justify-center p-4">
        <h1 className="text-center font-bold text-2xl">
          Welcome to the E-commerce website
        </h1>
      </div>
      {/* Right Section */}
      <div className="w-1/2 bg-white text-black flex items-center justify-center p-4">
        <div className="text-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
