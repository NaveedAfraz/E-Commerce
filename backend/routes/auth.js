const express = require("express");
const router = express.Router();
// const poolPromise = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Register } = require("../controller/auth");
const { Login } = require("../controller/auth");

// router.get("/login", Login);
router.post("/register", Register);

exports.router = router;