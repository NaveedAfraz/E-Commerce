const express = require("express");
const { createOrder } = require("../../controller/shop/orders");
const { capturePayment } = require("../../controller/shop/orders");
const {
  getOrderAllDetails,
  getOrderDetails,
} = require("../../controller/shop/orders");

const router = express.Router();

router.post("/createOrders", createOrder);
router.post("/capturePayment", capturePayment);
router.get("/getAllOrders/:orderId", getOrderAllDetails);
router.get("/getSpecificOrderDetails/:orderitemID", getOrderDetails);

module.exports = router;
