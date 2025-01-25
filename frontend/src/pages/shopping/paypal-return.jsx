import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { productsSold } from "@/store/admin-Slice/admin-Order";
import { fetchcartDetails } from "@/store/shop-Slice/cart";
import { capturePayment } from "@/store/shop-Slice/orders";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

export default function Paypalreturn() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("token");
  const payerId = params.get("PayerID");
  const [error, setError] = useState("");
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.userCart);

  const [cartDetails, setCartDetails] = useState([]);

  // Fetch cart details
  useEffect(() => {
    if (user?.userid) {
      dispatch(fetchcartDetails(user.userid)).then((data) => {
        setCartDetails(data?.payload?.data || []);
      });
    }
  }, [dispatch, user?.userid]);
  console.log(cartDetails, user);

  // Handle payment capture and product sold tracking
  useEffect(() => {
    if (paymentId && payerId && cartDetails.length > 0) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
      dispatch(capturePayment({ paymentId, payerId, orderId }))
        .then((data) => {
          console.log("Payment capture response:", data);

          if (data?.payload?.success) {
            dispatch(productsSold({ cartDetails, user })).then((res) => {
              console.log("Products sold response:", res);
              sessionStorage.removeItem("currentOrderId");
              if (res?.error?.code) {
                setError("Payment capture failed,Please Try Again later");
              }
              // Redirect to success page (optional)
               window.location.href = "/shopping/payment-success";
            });
          } else {
            setError(data?.payload);
            console.log("kdkdkd");
          }
        })
        // .catch((err) => {
        //   console.error("Error in capturePayment:", err);
        //   setError();
        // });
    }
  }, [paymentId, payerId, cartDetails, dispatch]);

  const navigate = useNavigate();

  return (
    <Card className="w-full my-28 max-w-md mx-auto shadow-lg border border-gray-200 bg-white">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold text-gray-800">
          Processing Payment... Please wait!
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-4 text-center">
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </CardContent>
      <div className="p-4 text-center">
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded transition"
          onClick={() => navigate("/shopping/checkout")}
          disabled={!error}
        >
          Back To Cart
        </Button>
      </div>
    </Card>
  );
}
