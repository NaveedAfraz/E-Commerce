const express = require("express");
const {
  addtocart,
  updateQuantity,
  deleteProduct,
  fetchCartDetails,
} = require("../../controller/shop/cart");
const router = express.Router();

router.post("/addToCart", addtocart);
router.put("/UpdateQuantity/:productID", updateQuantity);
router.get("/fetchCartDetails/:userID", fetchCartDetails);
router.delete("/deleteProduct/:userID/:productID", deleteProduct);
module.exports = router;
