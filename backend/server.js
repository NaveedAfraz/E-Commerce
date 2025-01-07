const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const cookieParser = require("cookie-parser");
const { Login, Register } = require("./controller/auth");
const { router } = require("./routes/auth");

require("dotenv").config(require("dotenv").config({ path: "../.env" }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the server" });
});

// app.get("/auth",Register)
// app.post("/auth",Login)

app.use("/auth", router);
app.listen(3006, () => {
  console.log("Server is running on http://localhost:3006");
});
