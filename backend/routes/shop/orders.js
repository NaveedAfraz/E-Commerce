const express = require("express");
const createOrder = require("../../controller/shop/orders");
const router = express.Router();

router.post("/createOrders", createOrder);

module.exports = router;
