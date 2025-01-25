const pool = require("../../db");

const getAllOrdersOfUsers = async (req, res) => {
  // console.log("orderId", orderId);

  try {
    // if (!orderId) {
    //   console.log("orderID is not there pls fetch it from client");
    //   return res.status(404).json({
    //     success: false,
    //     message: "orderID is not there pls fetch it from client",
    //   });
    // }
    const q = "SELECT * FROM Orders";
    const [orderDetails] = await pool.execute(q);
    console.log("orderDetails", orderDetails);

    if (orderDetails.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    return res.status(200).json({
      success: true,
      orderDetails: orderDetails,
      message: "Order details fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  const { orderitemID } = req.params;
  console.log("Received orderitemID:", orderitemID);

  try {
    // Validate orderitemID
    if (!orderitemID) {
      console.log("OrderItemID is missing. Please provide it from the client.");
      return res.status(400).json({
        success: false,
        message: "OrderItemID is required. Please provide it.",
      });
    }

    // Updated SQL query to include Address table
    const q = `
      SELECT 
        OrderItems.*, 
        Orders.*, 
        address.*
      FROM 
        OrderItems
      INNER JOIN 
        Orders
      ON 
        OrderItems.orderID = Orders.orderID
      INNER JOIN 
        address
      ON 
        Orders.addressID = address.addressID
      WHERE 
        OrderItems.orderID = ?;
    `;

    // Execute query
    const [orderitemDetails] = await pool.execute(q, [orderitemID]);
    console.log("Fetched orderitemDetails:", orderitemDetails);

    // Check if any order details were found
    if (orderitemDetails.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for the given OrderItemID.",
      });
    }

    // Respond with fetched details
    return res.status(200).json({
      success: true,
      data: orderitemDetails,
      message: "Order details fetched successfully.",
    });
  } catch (error) {
    // Log error for debugging
    console.error("Error fetching order details:", error);

    // Respond with error message
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching order details.",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  //const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    // Check if the order exists
    const [orderCheck] = await pool.execute(
      "SELECT * FROM Orders WHERE orderId = ?",
      [id]
    );

    if (!orderCheck.length) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    // Update the order status
    await pool.execute("UPDATE Orders SET orderStatus = ? WHERE orderId = ?", [
      orderStatus,
      id,
    ]);

    res.status(200).json({
      success: true,
      message: "Order status is updated successfully!",
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const ProductsSold = async (req, res) => {
  const { cartDetails, user } = req.body;
  const userId = user.userid;

  console.log(cartDetails, "cartItems");
  console.log(user, "user");

  if (!cartDetails || !user) {
    return res.status(404).json({
      success: false,
      message: "Cart items or user not found",
    });
  }

  try {
    // Fetch the orderID from the Orders table
    const orderQuery = `SELECT orderID FROM Orders WHERE userId = ? ORDER BY orderDate DESC LIMIT 1`;
    const [orderResult] = await pool.execute(orderQuery, [userId]);

    if (orderResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No order found for this user",
      });
    }

    const orderID = orderResult[0].orderID;

    // Prepare the values dynamically for bulk insertion
    const values = cartDetails.map(
      (item) =>
        `(${orderID}, ${item.productID}, '${item.title}', ${item.quantity}, '${item.price}', NOW(), '${item.image}' ,'${item.brand}')`
    );

    // Construct the full SQL query dynamically
    const insertQuery = `INSERT INTO Sale (orderID, productID, Title, soldQuantity, price, sold_at,productImg,brand) VALUES ${values.join(
      ","
    )}`;

    // Execute the query
    const [response] = await pool.execute(insertQuery);

    if (response.affectedRows > 0) {
      console.log("Products sold updated successfully");

      // Delete cart items using userID because i cannot deleet it by cart id there are multiple cartid of a user so i am just deleetd the userID cart
      const [response2] = await pool.execute(
        "DELETE FROM cart WHERE userID = ?",
        [userId]
      );
      if (response2.affectedRows > 0) {
        console.log("Cart items deleted successfully");
        return res.status(200).json({
          success: true,
          message:
            "Products sold updated successfully and the cart is deleted successfully",
          data: response,
        });
      }
    }

    return res.status(400).json({
      success: false,
      message: "Products sold not updated",
    });
  } catch (error) {
    console.log("Error in ProductsSold", error);
    return res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};
const getTopSellingProducts = async (req, res) => {
  try {
    const query = `
      SELECT 
          productID, 
          title, 
          productImg,
          brand,
          SUM(soldQuantity) AS totalSoldQuantity, 
          MAX(price) AS price, 
          COUNT(*) AS salesCount 
      FROM 
          Sale
      GROUP BY 
          productID, title , productImg, brand
      ORDER BY 
          totalSoldQuantity DESC 
      LIMIT 10;
    `;

    const [results] = await pool.execute(query);

    if (results.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Top selling products retrieved successfully",
        data: results,
      });
    }

    return res.status(404).json({
      success: false,
      message: "No products found",
    });
  } catch (error) {
    console.error("Error fetching top-selling products:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching top-selling products",
    });
  }
};

module.exports = {
  getOrderDetailsForAdmin,
  getAllOrdersOfUsers,
  updateOrderStatus,
  ProductsSold,
  getTopSellingProducts,
};
