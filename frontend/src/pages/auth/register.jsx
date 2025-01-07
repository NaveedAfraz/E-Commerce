import { CommonForm } from "@/components/common/commonForm";
import { registerFormControls } from "@/config/config";
import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const intialState = {
    userName: "",
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(intialState);
  const onSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
    try {
      const res = await axios.post("http://localhost:3006/auth/Register", {
        formData,
        withCredentials: true,
      });
      console.log(res.data);
      console.log("Form Submitted");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formComponentDetails={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}
