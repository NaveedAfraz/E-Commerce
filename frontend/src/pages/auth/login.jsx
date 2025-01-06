import { CommonForm } from "@/components/common/commonForm";
import React, { useState } from "react";
import { use } from "react";

const intialState = {
  username: "",
  password: "",
  email: "",
};
function login() {
  const [formData, setFormData] = useState(intialState);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    console.log("Form Submitted");
  };
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default login;
