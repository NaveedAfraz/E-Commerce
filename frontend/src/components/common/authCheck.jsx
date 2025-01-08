import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AuthCheck({ isAuth, user, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    // if (!isAuth && location.pathname.includes("shopping")) {
    //   navigate("/auth/login");
    // }
    console.log(isAuth, user, location.pathname);

    if (location.pathname === "/") {
      if (!isAuthenticated) {
        navigate("/auth/login");
      } else {
        if (user?.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("shopping/home");
        }
      }
    }
    if (
      !isAuth &&
      !(
        location.pathname.includes("/login") ||
        location.pathname.includes("/register")
      )
    ) {
      navigate("/auth/register");
    }
    if (!isAuth && location.pathname == "/") {
      navigate("/auth/login");
    }
    if (
      (isAuth && location.pathname.includes("login")) ||
      (location.pathname.includes("register") && isAuth)
    ) {
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/shopping/home");
      }
    }
    if (
      isAuth &&
      user?.role !== "admin" &&
      location.pathname.includes("admin")
    ) {
      navigate("/unauthorized");
    }

    if (
      isAuth &&
      user?.role == "admin" &&
      location.pathname.includes("shopping")
    ) {
      console.log("running");
      navigate("/admin/dashboard");
    }
  }, [isAuth, user, location.pathname, navigate]);
  return <div>{children}</div>;
}
