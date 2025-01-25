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
import OrderDetails from "./OrderDetails";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
} from "@/store/admin-Slice/admin-Order";
import AdminOrderDetails from "./OrderDetails";

function Orders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { orderList, OrderDetails } = useSelector((state) => state.AdminOrders);
  console.log(orderList);
  console.log(openDetailsDialog);

  const dispatch = useDispatch();
  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId)).then((res) => {
      console.log(res);
      setOpenDetailsDialog(true);
    });
  }
  console.log(OrderDetails);

  useEffect(() => {
    dispatch(getAllOrdersForAdmin()).then((res) => {
      console.log(res);
    });
  }, [dispatch]);

  // useEffect(() => {
  //   if (OrderDetails !== null) setOpenDetailsDialog(true);
  // }, [OrderDetails]);
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
                        {OrderDetails && OrderDetails.length > 0 ? (
                          <AdminOrderDetails
                            orderDetails={OrderDetails}
                            setOpenDetailsDialog={setOpenDetailsDialog}
                          ></AdminOrderDetails>
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
export default Orders;
