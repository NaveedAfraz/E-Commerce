const express = require("express");
const router = express.Router();  
// const poolPromise = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Register, logout, authCheck } = require("../controller/auth");
const { Login } = require("../controller/auth");

router.post("/Login", Login);
router.post("/Register", Register);
router.post("/logout", logout);
router.post("/authCheck",authCheck)
exports.router = router;
