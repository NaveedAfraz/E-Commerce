require("dotenv").config({ path: "./.env" });
const mysql = require("mysql2");
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
console.log("DB_USER:", process.env.DB_USER); // Check if DB_USER is being loaded correctly

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to the MySQL database successfully.");
    connection.query("SELECT DATABASE();", (queryErr, results) => {
      if (queryErr) {
        console.error("Error executing query:", queryErr.message);
      } else {
        console.log("Connected to the database:", results[0]["DATABASE()"]);
      }
      connection.release(); // Release the connection back to the pool
    });
  }
});

const promisePool = pool.promise();
module.exports = promisePool;
