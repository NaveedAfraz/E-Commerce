const  promisePool  = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// login
// const Login = async (req, res) => {
//   const { formData } = req.body;
//   console.log(formData);
//   const { username, password } = formData;

//   const q = `SELECT * FROM users WHERE username = ${username} AND password = ${password}`;
//   try {
//     const [data] = pool.execute(q, [username, password]);
//     if (data.length > 0) {
//       console.log(err);
//       res.status(404).json({ message: "User not found" });
//     } else {
//       res.status(200).json({ data: results, message: "User found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "error logging in" });
//   }
// };

// register
const Register = async (req, res) => {
  const { formData } = req.body;
  console.log("Form Data:", formData);

  // Validate formData
  if (!formData || !formData.userName || !formData.password || !formData.email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const { userName, password, email } = formData;
  console.log("User Data:", userName, password, email);

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const q = `INSERT INTO userAuth (userName, password, Email) VALUES (?, ?, ?)`;
  console.log("SQL Query:", q);
  console.log("Parameters:", [userName, hashedPassword, email]);

  try {
    // Execute the query
    const [result] = await promisePool.execute(q, [userName, hashedPassword, email]);
    console.log("Query Result:", result);

    // Check if the query was successful
    if (result.affectedRows > 0) {
      res.status(200).json({ data: result, message: "User registered" });
    } else {
      res.status(404).json({ message: "User not registered" });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};
//logout

//reCheckAuth

module.exports = { Register };
