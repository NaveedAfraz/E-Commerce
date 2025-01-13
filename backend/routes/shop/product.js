const express = require("express");
const { getfilteredProducts } = require("../../controller/shop/shop");
const router = express.Router();

router.get("/fetchAllProducts", getfilteredProducts);

module.exports = router;
