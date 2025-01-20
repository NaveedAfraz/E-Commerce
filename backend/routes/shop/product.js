const express = require("express");
const {
  getfilteredProducts,
  fetchDetails,
} = require("../../controller/shop/product");
const router = express.Router();

router.get("/fetchAllProducts", getfilteredProducts);
router.get("/fetchProductDetails/:id", fetchDetails);
module.exports = router;
