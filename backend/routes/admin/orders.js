const express = require("express");

const {
  getAllOrdersOfUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  ProductsSold,
  getTopSellingProducts,
} = require("../../controller/admin/orders");

const router = express.Router();

router.get("/getAllOrders", getAllOrdersOfUsers);
router.get("/getSpecificOrderDetails/:orderitemID", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);
router.post("/productsSold", ProductsSold);
router.get("/topSellingProducts", getTopSellingProducts);
module.exports = router;
