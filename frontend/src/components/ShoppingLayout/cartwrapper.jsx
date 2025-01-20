import React from "react";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import CartContent from "./cartContent";
import { useNavigate } from "react-router-dom";

export default function Cartwrapper({ cartItems, setOpenCartSheet }) {
  // console.log(cartItems);
  const totalCartAmount = cartItems?.reduce((total, item) => {
    return total + item.salePrice * item.quantity;
  }, 0);
  //console.log(totalCartAmount);
  const navigate = useNavigate();
  return (
    <>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          {cartItems && cartItems.length > 0
            ? cartItems.map((item) => <CartContent cartItem={item} />)
            : null}
        </div>
        <div className="mt-8 space-y-4">
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <Button
            onClick={() => {
              navigate("/shopping/checkout");
              setOpenCartSheet(false);
            }}
            className="w-full mt-6"
          >
            Checkout
          </Button>
        </div>
      </SheetContent>{" "}
    </>
  );
}
