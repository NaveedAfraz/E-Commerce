const express = require("express");
const { addReview, getReviews } = require("../../controller/shop/reviews");
const router = express.Router();

router.post("/addReview/:id", addReview);
router.get("/getReviews/:productID", getReviews);
module.exports = router;
