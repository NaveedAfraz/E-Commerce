import React, { useEffect } from "react";
import { useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { CommonForm } from "../common/commonForm";
import {
  getAllOrdersForAdmin,
  updateOrderStatus,
} from "@/store/admin-Slice/admin-Order";
const initialFormData = {
  status: "",
};
function AdminOrderDetails({ orderDetails, setOpenDetailsDialog }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();
  console.log(orderDetails);

  function handleUpdateStatus(event) {
    event.preventDefault();
    console.log("running");
    console.log(formData);
    const { status } = formData;
    if (status == "") {
      toast({
        title: "Please Select Order Status",
        duration: 2000,
        className: "bg-red-500 text-white",
      });
    } else {
      dispatch(
        updateOrderStatus({
          id: orderDetails[0]?.orderID,
          orderStatus: status,
        })
      ).then((res) => {
        console.log(res);
        if (res.payload.success) {
          setOpenDetailsDialog(false);
          dispatch(getAllOrdersForAdmin()).then((res) => {
            console.log(res);
            toast({
              title: "Order Status Updated Successfully",
              duration: 2000,
              className: "bg-green-500 text-white",
            });
          });
        }
      });
    }
  }
  // useEffect(() => {}, [dispatch]);

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="sm:max-w-[600px]">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <div className="flex mt-6 items-center justify-between">
              <p className="font-medium">Order ID</p>
              <Label>{orderDetails[0]?.orderID}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Order Date</p>
              <Label>
                {orderDetails[0]?.orderDate
                  ? orderDetails[0].orderDate.split("T")[0]
                  : "N/A"}
              </Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Order Price</p>
              <Label>${orderDetails[0]?.totalAmount}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Payment method</p>
              <Label>{orderDetails[0]?.paymentMethod}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Payment Status</p>
              <Label>{orderDetails[0]?.paymentStatus}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Order Status</p>
              <Label>
                <Badge
                  className={`py-1 px-3 ${
                    orderDetails[0]?.orderStatus === "confirmed"
                      ? "bg-green-500"
                      : orderDetails[0]?.orderStatus === "rejected"
                      ? "bg-red-600"
                      : "bg-black"
                  }`}
                >
                  {orderDetails[0]?.orderStatus}
                </Badge>
              </Label>
            </div>
          </div>
          <Separator />
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="font-medium">Order Details</div>
              <ul className="grid gap-3">
                {orderDetails && orderDetails?.length > 0
                  ? orderDetails?.map((item) => (
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
                <span>{orderDetails[0]?.address}</span>
                <span>{orderDetails[0]?.city}</span>
                <span>{orderDetails[0]?.pincode}</span>
                <span>{orderDetails[0]?.phoneNO}</span>
                <span>{orderDetails[0]?.notes}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <CommonForm
            formComponentDetails={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update Order Status"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetails;
