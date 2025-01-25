import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Address } from "@/components/ShoppingLayout/address";
import CartContent from "@/components/ShoppingLayout/cartContent";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createNewOrder } from "@/store/shop-Slice/orders";

function Checkout() {
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const { cartItems } = useSelector((state) => state.userCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shoppingOrder);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const { error } = useSelector((state) => state.shoppingOrder);
  console.log(error);

  const totalCartAmount = cartItems?.reduce(
    (total, item) => total + item.salePrice * item.quantity,
    0
  );

  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleInitiatePaypalPayment = () => {
    if (currentSelectedAddress == null) {
      toast({
        title: "Please select an address",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

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

    dispatch(createNewOrder(orderData)).then((data) => {
      console.log("data", data);

      if (data?.payload?.success) {
        setIsPaymemntStart(true);
      } else {
        setIsPaymemntStart(false);
        toast({
          title: error,
          duration: 3000,
          className: "bg-red-500 text-white",
        });
      }
    });
  };

  useEffect(() => {
    if (approvalURL) {
      window.location.href = approvalURL;
    }
  }, [approvalURL]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative h-[550px]">
        <img
          src="/clark-street-mercantile-qnKhZJPKFD8-unsplash.jpg"
          className="absolute h-full w-full object-cover object-center"
          alt="Hero background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black/100" />
      </div>

      {/* Content Section */}
      <div className="flex-grow relative inset-x-0 grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 mx-14 bg-white rounded-t-3xl shadow-lg -mt-[10%] ">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
          showAddressForm={showAddressForm}
          setShowAddressForm={setShowAddressForm}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.length > 0
            ? cartItems.map((item) => (
                <CartContent key={item.id} cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiatePaypalPayment} className="w-full">
              {isPaymentStart
                ? "Processing Paypal Payment..."
                : "Checkout with Paypal"}
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Section */}
    </div>
  );
}

export default Checkout;
