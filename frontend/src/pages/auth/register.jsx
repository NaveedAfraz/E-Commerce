import { CommonForm } from "@/components/common/commonForm";
import { Toast } from "@/components/ui/toast";
import { registerFormControls } from "@/config/config";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/store/auth-Slice/auth-slice";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
const intialState = {
  userName: "",
  email: "",
  password: "",
};
export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState(intialState);
  console.log(formData);

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
    // try {
    //   const res = await axios.post("http://localhost:3006/auth/Register", {
    //     formData,
    //     withCredentials: true,
    //   });
    //   console.log(res.data);
    //   console.log("Form Submitted");
    // } catch (error) {
    //   console.log(error);
    // }
    dispatch(registerUser(formData)).then((res) => {
      console.log(res);
      if (res?.meta?.requestStatus == "fulfilled") {
        console.log("Form Submitted");
        toast({
          title: "registerd successfully",
          status: "success",
          duration: 3000,
        });
        // navigate("/auth/login");
      }
      setTimeout(() => {
        navigate("/auth/login");
      }, 3000);
    });
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
