import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AuthCheck({ isAuth, user, children }) {
  const location = useLocation();
  const navigate = useNavigate();

  console.log(isAuth, user, `location ${location.pathname}`);

  if (location.pathname === "/") {
    console.log("running");
    if (!isAuth) {
      navigate("/auth/login");
      return;
    } else {
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
        return;
      } else {
        navigate("/shopping/home");
        return;
      }
    }
  }

  if (
    (isAuth && location.pathname.includes("login")) ||
    (location.pathname.includes("register") && isAuth)
  ) {
    console.log("running3");
    if (user?.role === "admin") {
      navigate("/admin/dashboard");
      return;
    } else {
      navigate("/shopping/home");
      return;
    }
  }

  if (
    !isAuth &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    console.log("running2");
    navigate("/auth/login");
    return;
  }

  if (!isAuth && location.pathname === "/") {
    navigate("/auth/login");
    return;
  }

  if (isAuth && user?.role !== "admin" && location.pathname.includes("admin")) {
    console.log("running4");
    navigate("/unauthorized");
    return;
  }

  if (
    isAuth &&
    user?.role === "admin" &&
    location.pathname.includes("shopping")
  ) {
    console.log("running5");
    navigate("/admin/dashboard");
    return;
  }

  return <div>{children}</div>;
}
