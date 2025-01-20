import { Address } from "@/components/ShoppingLayout/address";
import CartContent from "@/components/ShoppingLayout/cartContent";
import { Button } from "@/components/ui/button";
import { createNewOrder } from "@/store/shop-Slice/orders";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function Checkout() {
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const { cartItems } = useSelector((state) => state.userCart);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const totalCartAmount = cartItems?.reduce((total, item) => {
    return total + item.salePrice * item.quantity;
  }, 0);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  console.log(cartItems);
  console.log(currentSelectedAddress);
  const dispatch = useDispatch();
  const handleInitiatePaypalPayment = () => {
    console.log(user?.userid);
    console.log(cartItems);

    // here th eproblem is the cartID is on auto increment if i cannot use it because only per user there should be one cart id per order i should have made the cart table and cart item table separately but i did not do that so i am stuck here amd i made only cart so i will use userID on the cartid instaed
    const orderData = {
      userId: user?.userid,
      cartId: cartItems[0].cartID,
      cartItems: cartItems.map((singleCartItem) => ({
        productId: singleCartItem?.productID,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?.addressID,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phoneNO,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };
    console.log(orderData);
    dispatch(createNewOrder(orderData)).then((data) => {
      console.log(data);
      if (data?.payload?.success) {
        setIsPaymemntStart(true);
      } else {
        setIsPaymemntStart(false);
      }
    });
  };
  return (
    <div className="relative flex flex-col">
      <div className="relative h-[550px] w-full">
        <img
          src="/clark-street-mercantile-qnKhZJPKFD8-unsplash.jpg"
          className="absolute h-full w-full object-cover object-center"
          alt="Hero background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/70 to-black/80" />
      </div>
      <div className="absolute inset-x-0 top-[70%] grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 mx-14 bg-white rounded-t-3xl shadow-lg">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
          showAddressForm={showAddressForm}
          setShowAddressForm={setShowAddressForm}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.length > 0
            ? cartItems.map((item) => <CartContent cartItem={item} />)
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiatePaypalPayment} className="w-full">
              Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
