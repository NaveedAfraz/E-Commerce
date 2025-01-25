import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "lucide-react";
import { Dialog } from "../ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import AdminOrders from "@/pages/admin/orders";
import {
  getAllOrderDetails,
  getSpecificOrderDetails,
} from "@/store/shop-Slice/orders";
import ShoppingOrderDetailsView from "./ShoppingOrderDetailsView";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector(
    (state) => state.shoppingOrder
  );
  const dispatch = useDispatch();
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  function handleFetchOrderDetails(getId) {
    console.log(getId);
    dispatch(getSpecificOrderDetails(getId)).then((res) => {
      console.log(res);
      if (res.payload) {
        console.log("run");
        setShowOrderDetails(true);
      }
    });
  }

  useEffect(() => {
    dispatch(getAllOrderDetails(user?.userid));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);
  // console.log(orderList[0].orderStatus);
  console.log(orderDetails);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                  <TableRow>
                    <TableCell>{orderItem?.orderID}</TableCell>
                    <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block rounded px-4 py-2 text-sm font-medium ${
                          orderItem?.orderStatus === "confirmed"
                            ? "bg-green-500 rounded-3xl text-white"
                            : orderItem?.orderStatus === "rejected"
                            ? "bg-red-600 rounded-3xl text-white"
                            : "bg-gray-700 rounded-3xl text-white"
                        }`}
                      >
                        {orderItem?.orderStatus}
                      </span>
                    </TableCell>
                    <TableCell>${orderItem?.totalAmount}</TableCell>
                    <TableCell>
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          // dispatch(resetOrderDetails());
                        }}
                      >
                        <Button
                          onClick={() =>
                            handleFetchOrderDetails(orderItem?.orderID)
                          }
                        >
                          View Details
                        </Button>
                        {showOrderDetails && orderDetails?.length != 0 ? (
                          <ShoppingOrderDetailsView
                            OrderDetails={orderDetails}
                          />
                        ) : null}
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
