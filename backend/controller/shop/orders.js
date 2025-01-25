const paypal = require("@paypal/checkout-server-sdk");
const pool = require("../../db"); // Your MySQL connection pool setup

// Set up PayPal Environment
const environment = new paypal.core.SandboxEnvironment(
  "Afdk2Zb93EfHmvaydFH7Zo3s5roUH7r-Ng6lblqRRbK1ULnQFPMxLMflOAVJm4orl6G5lMJR_X20fpm8",
  "EJXeU9gwN8lBmwIQ8dqNJ78dBAgVmxI7ApM0LORl7a52zE5CeQquQEEDnPdgeX7pDUV4Z66JXT8_OxDk"
);

const client = new paypal.core.PayPalHttpClient(environment);

const createOrder = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const {
      userId,
      cartId,
      cartItems,
      addressInfo,
      totalAmount,
      currency_code = "USD", // Default currency
      paymentMethod,
      orderStatus,
      paymentStatus,
      paymentId,
      payerId,
    } = req.body;
    console.log(cartItems);

    // Validate required fields
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error("Cart items are required.");
    }
    if (!addressInfo || !addressInfo.addressId) {
      throw new Error("Address ID is required.");
    }

    // Check if the address exists
    const [addressCheck] = await connection.execute(
      "SELECT addressId FROM address WHERE addressId = ?",
      [addressInfo.addressId]
    );
    if (!addressCheck.length) {
      throw new Error("Invalid address ID.");
    }
    for (const item of cartItems) {
      const [productResult] = await connection.execute(
        "SELECT totalStock FROM productsAdmin WHERE productID = ?",
        [item.productId]
      );

      if (productResult.length === 0) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const availableStock = productResult[0].totalStock;
      if (availableStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${item.title}. 
            Requested: ${item.quantity}, Available: ${availableStock}`,
          productId: item.productId,
        });
      }
    }
    for (const item of cartItems) {
      const [productResult] = await connection.execute(
        "SELECT totalStock FROM productsAdmin WHERE productID = ?",
        [item.productId]
      );

      if (productResult.length === 0) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const availableStock = productResult[0].totalStock;
      if (availableStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${item.title}. 
            Requested: ${item.quantity}, Available: ${availableStock}`,
          productId: item.productId,
        });
      }
    }
    // Format order dates
    const orderDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    const orderUpdateDate = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // Calculate total dynamically (optional server-side validation)
    const calculatedTotal = cartItems.reduce((sum, item) => {
      console.log(item.price, item.quantity);

      return sum + item.price * item.quantity;
    }, 0);
    console.log(calculatedTotal, "calculatedTotal");

    if (parseFloat(totalAmount) !== calculatedTotal) {
      throw new Error("Total amount mismatch.");
    }

    // Create PayPal Order
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "AUTHORIZE",
      purchase_units: [
        {
          amount: {
            currency_code,
            value: calculatedTotal,
            breakdown: {
              item_total: {
                currency_code,
                value: calculatedTotal,
              },
            },
          },
          items: cartItems.map((item) => ({
            name: item.title,
            unit_amount: {
              currency_code,
              value: item.price,
            },
            quantity: item.quantity.toString(),
          })),
        },
      ],
      application_context: {
        return_url: "http://localhost:5173/shopping/paypal-return",
        cancel_url: "http://localhost:5173/shopping/paypal-cancel",
      },
    });

    const payPalResponse = await client.execute(request);
    const approvalURL = payPalResponse.result.links.find(
      (link) => link.rel === "approve"
    ).href;
    // console.log(totalAmount, "totalAmount is this ");
    console.log(
      "ordeerStatus,paymentMethod,paymentStatus",
      orderStatus,
      paymentMethod,
      paymentStatus
    );

    // Insert the order into the database
    console.log("Calculated Total to Insert:", calculatedTotal);
    const [orderResult] = await connection.execute(
      `INSERT INTO Orders (
        userId, cartId, addressId, orderStatus, paymentMethod,
        paymentStatus, paymentId, payerId, totalAmount, orderDate, orderUpdateDate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId || 1,
        cartId,
        addressInfo.addressId,
        orderStatus,
        paymentMethod,
        paymentStatus,
        paymentId || 1,
        payerId || 1,
        calculatedTotal,
        orderDate,
        orderUpdateDate,
      ]
    );

    const orderId = orderResult.insertId;

    // Insert order items into the database
    const orderItemsPromises = cartItems.map((item) =>
      connection.execute(
        `INSERT INTO OrderItems (
          orderId, productId, quantity, price, title
        ) VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.productId, item.quantity, item.price, item.title]
      )
    );
    await Promise.all(orderItemsPromises);

    // Commit the transaction
    await connection.commit();

    // Return the approval URL
    res.status(201).json({
      success: true,
      approvalURL,
      orderId,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while creating the order.",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

const capturePayment = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { paymentId, payerId, orderId } = req.body;
    //console.log(paymentId, payerId, orderId);

    // Start a transaction
    await connection.beginTransaction();
    // console.log("Executing query: SELECT * FROM Orders WHERE orderID = ?", [orderId]);

    // Fetch the order by orderId
    const [orderResult] = await connection.execute(
      "SELECT * FROM Orders WHERE orderID = ?",
      [orderId]
    );

    if (orderResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order cannot be found",
      });
    }

    const order = orderResult[0];

    // Update the order's payment status and order status
    const updates = await connection.execute(
      "UPDATE Orders SET paymentStatus = ?, orderStatus = ?, paymentId = ?, payerId = ? WHERE orderID = ?",
      ["paid", "confirmed", paymentId, payerId, orderId]
    );
    console.log("updates: ", updates);

    // Fetch all cart items for the order
    const [cartItems] = await connection.execute(
      "SELECT * FROM OrderItems WHERE orderID = ?",
      [orderId]
    );
    console.log("cartItems: are here " + cartItems);

    for (const item of cartItems) {
      console.log(item.productID);
      if (!item.productID) {
        console.error(
          "Error: productID is missing or undefined in the cart item:",
          item
        );
        throw new Error("Missing productID in cart item.");
      }

      // Fetch the product by productId
      const [productResult] = await connection.execute(
        "SELECT * FROM productsAdmin WHERE productID = ?",
        [item.productID]
      );

      if (productResult.length === 0) {
        throw new Error(`Product not found for productId: ${item.productId}`);
      }

      const product = productResult[0];

      // Check stock availability
      if (product.totalStock < item.quantity) {
        console.log(
          `Not enough stock for product: ${product.title} (productId: ${item.productID})`
        );

        return res.status(403).json({
          success: false,
          message: "Not enough stock for product: " + product.title,
          productId: item.productID,
        });
      }

      // Deduct stock quantity
      await connection.execute(
        "UPDATE productsAdmin SET totalStock = totalStock - ? WHERE productID = ?",
        [item.quantity, item.productID]
      );
    }
    //  console.log(order);

    // Delete the cart
    const cartId = order.cartId;
    const userID = order.userid;
    // console.log("userID " + userID);

    // if (cartId) {
    //   // Delete cart items using userID because i cannot deleet it by cart id there are multiple cartid of a user so i am just deleetd the userID cart
    //   await connection.execute("DELETE FROM cart WHERE userID = ?", [userID]);
    // }

    // Commit the transaction
    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
    });
  } catch (e) {
    // Rollback transaction on error
    await connection.rollback();

    console.error("Error in capturePayment:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
      error: e.message,
    });
  } finally {
    connection.release();
  }
};

const getOrderAllDetails = async (req, res) => {
  const { orderId } = req.params;
  console.log("orderId", orderId);

  try {
    if (!orderId) {
      console.log("orderID is not there pls fetch it from client");
      return res.status(404).json({
        success: false,
        message: "orderID is not there pls fetch it from client",
      });
    }
    const q = "SELECT * FROM Orders WHERE userID = ?";
    const [orderDetails] = await pool.execute(q, [orderId]);
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

const getOrderDetails = async (req, res) => {
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

module.exports = {
  createOrder,
  capturePayment,
  getOrderAllDetails,
  getOrderDetails,
};
