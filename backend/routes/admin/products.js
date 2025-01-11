const express = require("express");
const router = express.Router();
const {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
} = require("../../controller/admin/products");
const { upload } = require("../../helper/image-upload");

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/addProduct", addProduct);
router.get("/fetchProducts", fetchAllProducts)
router.put("/editProduct/:id", editProduct)
router.delete("/deleteProduct/:id", deleteProduct)

module.exports = router;
