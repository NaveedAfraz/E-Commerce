import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

export default function AuthCheck({ isAuth, user, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  // useEffect(() => {
  //   // if (!isAuth && location.pathname.includes("shopping")) {
  //   //   navigate("/auth/login");
  //   // }
  //   console.log(isAuth, user, `location ${location.pathname}`);

  //   if (location.pathname == "/") {
  //     console.log("running");
  //     if (!isAuth) {
  //       navigate("/auth/login");
  //     } else {
  //       if (user?.role === "admin") {
  //         navigate("/admin/dashboard");
  //       } else {
  //         navigate("shopping/home");
  //       }
  //     }
  //   }
  //   if (
  //     (isAuth && location.pathname.includes("login")) ||
  //     (location.pathname.includes("register") && isAuth)
  //   ) {
  //     console.log("running3");
  //     if (user?.role === "admin") {
  //       navigate("/admin/dashboard");

  //     } else {
  //       navigate("/shopping/home");
  //       return;
  //     }
  //   }
  //   if (
  //     !isAuth &&
  //     !(
  //       location.pathname.includes("/login") ||
  //       location.pathname.includes("/register")
  //     )
  //   ) {
  //     console.log("running2");
  //     navigate("/auth/login");
  //   }
  //   if (!isAuth && location.pathname == "/") {
  //     navigate("/auth/login");
  //   }

  if (
    isAuth &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
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

  if (isAuth && user?.role !== "admin" && location.pathname.includes("admin")) {
    return <Navigate to="/unauth-page" />;
  }
console.log(user)
  if (
    isAuth &&
    user?.role === "admin" &&
    location.pathname.includes("shopping")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <div>{children}</div>;
}
