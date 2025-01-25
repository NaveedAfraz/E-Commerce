const pool = require("../../db");
const addReview = async (req, res) => {
  const { productID, userID, reviewMessage, reviewValue } = req.body;
  console.log(productID, userID, reviewMessage, reviewValue);

  if (!productID || !userID || !reviewMessage) {
    console.log("Please provide all values");
    return res.status(400).json({ msg: "Please provide all values" });
  }

  try {
    const purchaseQuery = `
      SELECT oi.productID
      FROM Orders o
      JOIN OrderItems oi ON o.orderID = oi.orderID
      WHERE o.userID = ? AND oi.productID = ?
      LIMIT 1;
    `;
    const [purchaseResult] = await pool.execute(purchaseQuery, [
      userID,
      productID,
    ]);
    console.log(" Purchase Result: ", purchaseResult);

    if (purchaseResult.length === 0) {
      return res
        .status(403)
        .json({ msg: "You cannot review a product you haven't purchased" });
    }
    const q1 = "SELECT * FROM reviews WHERE userID = ? And productID = ? ";
    const [result] = await pool.execute(q1, [userID, productID]);
    console.log("alreeady riviews :", result);

    if (result.length != 0) {
      console.log(result);
      return res
        .status(403)
        .json({ success: false, msg: "You Already reviewed this product" });
    }

    // Query to fetch userName from userAuth table
    const userQuery = "SELECT userName FROM userAuth WHERE userID = ?";
    const [userResult] = await pool.query(userQuery, [userID]);

    if (userResult.length === 0) {
      console.log("User not found");
      return res.status(404).json({ msg: "User not found" });
    }

    const userName = userResult[0].userName; // Extract the userName
    console.log("Fetched userName:", userName);

    // Query to insert the review
    const reviewQuery =
      "INSERT INTO reviews (productID, userID, userName, reviewMsg, reviewValue) VALUES (?, ?, ?, ?, ?)";
    const reviewValues = [
      productID,
      userID,
      userName,
      reviewMessage,
      reviewValue,
    ];

    console.log("Review values:", reviewValues);

    const [reviewResult] = await pool.query(reviewQuery, reviewValues);

    if (reviewResult.affectedRows === 1) {
      console.log("Review added successfully");
      return res
        .status(200)
        .json({ success: true, msg: "Review added successfully" });
    }
    return res
      .status(500)
      .json({ success: false, message: "Failed to add review" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

const getReviews = async (req, res) => {
  const { productID } = req.params;
  console.log(productID);

  if (!productID) {
    console.log(productID);
    return res.status(400).json({ msg: "Please provide productID" });
  }
  try {
    const q = "SELECT * FROM reviews WHERE productID = ?";
    const [result] = await pool.execute(q, [productID]);
    if (result) {
      console.log("Reviews fetched successfully");
      return res.status(200).json({ success: true, data: result });
    }
    return res.json({ msg: "No reviews found" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Something went wrong" });
  }
};

module.exports = { addReview, getReviews };
