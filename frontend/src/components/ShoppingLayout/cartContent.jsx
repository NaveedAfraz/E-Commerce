import { Minus, Plus, Trash } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  fetchcartDetails,
  updateProductQuantity,
} from "@/store/shop-Slice/cart";
import { useToast } from "@/hooks/use-toast";

export default function CartContent({ cartItem }) {
  console.log(cartItem);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  console.log(user);
  const { cartItems } = useSelector((state) => state.userCart);
  console.log(cartItems);
  const { toast } = useToast();
  const handleUpdateQuantity = (cartItem, action) => {
    console.log(cartItem.productID, action);
    dispatch(
      updateProductQuantity({
        userid: user.userid,
        productID: cartItem.productID,
        action,
      })
    ).then((res) => {
      toast({
        title: "Cart item is updated successfully",
        duration: 2000,
      });
      console.log("updated");
      console.log(res);
    });
  };

  const handleCartItemDelete = (cartItem) => {
    console.log(cartItem.productID);
    dispatch(
      deleteProduct({
        userID: user.userid,
        productID: cartItem.productID,
      })
    ).then((res) => {
      if (res?.payload?.sucess) {
        dispatch(fetchcartDetails(user.userid)).then((res) => {
          toast({
            title: "Cart item is deleted successfully",
            duration: 2000,
          });
          console.log("feteched after deletion ");
        });
      }
      console.log(res);
    });
  };
  return (
    <div className="flex items-center space-x-4">
      <>
        <img
          src={cartItem?.image}
          alt={cartItem?.title}
          className="w-20 h-20 rounded object-cover"
        />
        <div className="flex-1">
          <h3 className="font-extrabold">{cartItem?.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Button
              variant="outline"
              className="h-8 w-8 rounded-full"
              size="icon"
              disabled={cartItem?.quantity === 1}
              onClick={() => handleUpdateQuantity(cartItem, "minus")}
            >
              <Minus className="w-4 h-4" />
              <span className="sr-only">Decrease</span>
            </Button>
            <span className="font-semibold">{cartItem?.quantity}</span>
            <Button
              variant="outline"
              className="h-8 w-8 rounded-full"
              size="icon"
              onClick={() => handleUpdateQuantity(cartItem, "plus")}
            >
              <Plus className="w-4 h-4" />
              <span className="sr-only">Decrease</span>
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="font-semibold">
            $
            {(
              (cartItem?.salePrice > 0
                ? cartItem?.salePrice
                : cartItem?.price) * cartItem?.quantity
            ).toFixed(2)}
          </p>
          <Trash
            onClick={() => handleCartItemDelete(cartItem)}
            className="cursor-pointer mt-1"
            size={20}
          />
        </div>{" "}
      </>
    </div>
  );
}
