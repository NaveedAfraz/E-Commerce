const promisePool = require("../../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// login
const Login = async (req, res) => {
  const { password, email } = req.body;
  //  console.log(password, email);
  // const { userName, password } = data;
  if (!password || !email) {
    return res.status(400).json({ message: "Missing email or password" });
  }
  const q = `SELECT * FROM userAuth WHERE Email = ?`;
  // const saltRounds = 10;
  // const hashedPassword = await bcrypt.hash(password, saltRounds);
  // cant compare hashed password with hashed password due to unique salt value in each hash function
  // console.log(hashedPassword)

  try {
    const [data] = await promisePool.execute(q, [email]);
    //console.log("detsils", data);
    console.log("running login ");
    if (data.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (data.length > 1) {
      return res.status(400).json({ message: "Multiple users found" });
    }

    if (data[0].Email !== email) {
      return res.status(404).json({ message: "Invalid username or email" });
    }

    const match = await bcrypt.compare(password, data[0].password);
    if (!match) {
      console.log("Invalid password");
      return res.status(403).json({ message: "Invalid password" });
    }
    // console.log(data[0]?.role);
    console.log(data[0]);
    // Create a JWT token
    const token = jwt.sign(
      {
        // id: data[0].id,
        userName: data[0].userName,
        role: data[0].role,
        userid: data[0].UserID,
        // email: data[0].Email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res
      .cookie("authToken", token, {
        httpOnly: true,
        sameSite: "None", // Required for cross-site cookies
        secure: true, // Cookies are sent only over HTTPS
        maxAge: 60 * 60 * 1000, // 1 hour
      })
      .status(200)
      .json({ message: "Logged in", userInfo: data[0] });
  } catch (error) {
    res.status(500).json({ message: "error logging in" });
  }
};

// register
const Register = async (req, res) => {
  // const { formData } = req.body;
  const { userName, password, email } = req.body;
  // console.log("Form Data:", formData);

  // Validate formData
  if (!userName || !password || !email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  console.log("User Data:", userName, password, email);

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const q = `INSERT INTO userAuth (userName, password, Email) VALUES (?, ?, ?)`;
  console.log("SQL Query:", q);
  console.log("Parameters:", [userName, hashedPassword, email]);

  try {
    // Execute the query
    const [result] = await promisePool.execute(q, [
      userName,
      hashedPassword,
      email,
    ]);
    console.log("Query Result:", result);

    // Check if the query was successful
    if (result.affectedRows > 0) {
      res.status(200).json({ data: result, message: "User registered" });
    } else {
      res.status(404).json({ message: "User not registered" });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};
//logout
const logout = async (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(200).json({ message: "Logged out" });
};

//reCheckAuth
const authCheck = async (req, res) => {
  try {
    const token = req.cookies.authToken; // Retrieve token from cookies
    console.log("Token is here:", token);
    console.log("Cookies received:", req.cookies);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized, token missing" });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    return res.status(200).json({
      message: "Authorized",
      userInfo: decoded.userName,
      role: decoded.role,
      email: decoded.email,
      userid: decoded.userid,
    });
  } catch (error) {
    console.error("Error verifying token:", error.message);

    // Provide specific feedback on the error
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { Register, Login, logout, authCheck };
