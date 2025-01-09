import React from "react";
import { useLocation, Navigate } from "react-router-dom";

export default function AuthCheck({ isAuth, user, children }) {
  const location = useLocation();

  // Redirect logic
  if (location.pathname === "/") {
    if (!isAuth) {
      return <Navigate to="/auth/login" />;
    } else {
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/shopping/home" />;
      }
    }
  }

  if (
    (isAuth && location.pathname.includes("login")) ||
    (location.pathname.includes("register") && isAuth)
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shopping/home" />;
    }
  }

  if (
    !isAuth &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    return <Navigate to="/auth/login" />;
  }

  if (!isAuth && location.pathname === "/") {
    return <Navigate to="/auth/login" />;
  }

  if (isAuth && user?.role !== "admin" && location.pathname.includes("admin")) {
    return <Navigate to="/unauthorized" />;
  }

  if (isAuth && user?.role === "admin" && location.pathname.includes("shopping")) {
    return <Navigate to="/admin/dashboard" />;
  }

  // Render children if no redirect conditions are met
  return <div>{children}</div>;
}
