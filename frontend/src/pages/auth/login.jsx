import { CommonForm } from "@/components/common/commonForm";
import { LoginFormControls, registerFormControls } from "@/config/config";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/store/auth-Slice/auth-slice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const intialState = {
  userName: "",
  password: "",
  email: "",
};

function login() {
  const [formData, setFormData] = useState(intialState);
  console.log(formData);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector((state) => state.auth);
  console.log(data);
  const onSubmit = async (e) => {
    e.preventDefault();

    dispatch(loginUser(formData)).then((res) => {
      console.log(res);
      if (res?.payload?.message === "Logged in") {
        toast({
          title: "Success",
          description: "User logged in successfully.",
          status: "success",
          duration: 3000, 
         // isclosable: true, // Optional: add a close button for the toast
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to log in. Please check your credentials.",
          status: "error",
          duration: 3000, // Customize duration if needed
         // isclosable: true, // Optional: add a close button for the toast
        });
      }
    });
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
