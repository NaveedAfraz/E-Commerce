require("dotenv").config({ path: "../frontend/.env" });
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
    console.error("Error connecting to the database:", err.message);
    return;
  }
  if (connection) {
    console.log("Connected to the database");
    connection.query("SELECT DATABASE() AS dbName", (err, results) => {
      if (err) {
        console.error("Error executing query:", err.message);
      } else {
        console.log("Connected to database:", results[0].dbName);
      }
      connection.release(); // Release the connection back to the pool
    });
  }
});
module.exports = pool.promise();
