const express = require("express");
const router = express.Router();

const { SearchByKeyword } = require("../../controller/shop/search");

router.get("/searchbar/:keyword", SearchByKeyword);

module.exports = router;
