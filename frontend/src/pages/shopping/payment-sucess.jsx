import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function PaymentSuccess() {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border my-28 border-gray-200 bg-white">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold text-green-600">
          Payment Successful!
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-4 text-center">
        <p className="text-gray-700">
          Thank you for your purchase. Your payment has been successfully
          processed.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center mt-4">
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded transition"
          onClick={() => (window.location.href = "/shopping/account/orders")}
        >
          View Orders
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PaymentSuccess;
