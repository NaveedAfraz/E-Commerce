import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AuthCheck({ isAuth, user, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    // if (!isAuth && location.pathname.includes("shopping")) {
    //   navigate("/auth/login");
    // }
    console.log(isAuth, user, `location ${location.pathname}`);

    if (location.pathname == "/") {
      console.log("running");
      if (!isAuth) {
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
      console.log("running2");
      navigate("/auth/register");
    }
    if (!isAuth && location.pathname == "/") {
      navigate("/auth/login");
    }
    if (
      (isAuth && location.pathname.includes("login")) ||
      (location.pathname.includes("register") && isAuth)
    ) {
      console.log("running3");
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
      console.log("running4");
      navigate("/unauthorized");
    }
    console.log(user?.role);
    if (
      isAuth &&
      user?.role == "admin" &&
      location.pathname.includes("shopping")
    ) {
      console.log("running5");
      navigate("/admin/dashboard");
    }
  }, [isAuth, user, location.pathname, navigate]);
  return <div>{children}</div>;
}
