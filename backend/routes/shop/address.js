const express = require("express");
const {
  fetchAllAddress,
  AddAddress,
  EditAddress,
  DeleteAddress,
} = require("../../controller/shop/address");
const router = express.Router();

router.get("/fetchAllAddress/:userID", fetchAllAddress);
router.post("/addAddress", AddAddress);
router.put("/updateAddress/:userID", EditAddress);
router.delete("/deleteAddress/:userID/:addressID", DeleteAddress);

module.exports = router;
