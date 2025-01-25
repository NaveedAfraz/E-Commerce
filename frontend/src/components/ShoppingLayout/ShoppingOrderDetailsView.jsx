import React from "react";
import { useState } from "react";

import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { CommonForm } from "../common/commonForm";
export default function ShoppingOrderDetailsView({ OrderDetails }) {
  const { user } = useSelector((state) => state.auth);
  console.log(OrderDetails);
  
  console.log(OrderDetails[0].orderDate);
  const formattedDate = OrderDetails?.orderDate
    ? OrderDetails[0].orderDate.split("T")[0]
    : "N/A";
  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{OrderDetails[0]?.orderID}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>
              {OrderDetails[0]?.orderDate
                ? OrderDetails[0].orderDate.split("T")[0]
                : "N/A"}
            </Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>${OrderDetails[0]?.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment method</p>
            <Label>{OrderDetails[0]?.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{OrderDetails[0]?.paymentStatus}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  OrderDetails[0]?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : OrderDetails[0]?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-black"
                }`}
              >
                {OrderDetails[0]?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {OrderDetails && OrderDetails?.length > 0
                ? OrderDetails?.map((item) => (
                    <li className="flex text-center justify-between space-x-4">
                      <span>Title: {item.title}</span>
                      <span>Quantity: {item.quantity}</span>
                      <span>Price: ${item.price}</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user.userName}</span>
              <span>{OrderDetails[0]?.address}</span>
              <span>{OrderDetails[0]?.city}</span>
              <span>{OrderDetails[0]?.pincode}</span>
              <span>{OrderDetails[0]?.phoneNO}</span>
              <span>{OrderDetails[0]?.notes}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
