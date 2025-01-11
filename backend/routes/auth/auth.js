const express = require("express");
const router = express.Router();  
// const poolPromise = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// const { } = require("../auth/auth");
const { Login , Register, logout, authCheck} = require("../../controller/auth/auth");

router.post("/Login", Login);
router.post("/Register", Register);
router.post("/logout", logout);
router.get("/authCheck",authCheck)
module.exports = router;
