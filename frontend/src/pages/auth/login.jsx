import { CommonForm } from "@/components/common/commonForm";
import { LoginFormControls, registerFormControls } from "@/config/config";
import axios from "axios";
import React, { useState } from "react";
import { use } from "react";
import { Link } from "react-router-dom";

const intialState = {
  userName: "",
  password: "",
  email: "",
};
function login() {
  const [formData, setFormData] = useState(intialState);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:3006/auth/login", {
        params : formData,
      });
      // const data = await res.json();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    console.log(formData);
    console.log("Form Submitted");
  };
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Log into Your Account
        </h1>
        <p className="mt-2">
          dont have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formComponentDetails={LoginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default login;
