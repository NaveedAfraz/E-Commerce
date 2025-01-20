const paypal = require("../../helper/paypal");
const pool = require("../../db");
const mysql = require("mysql2/promise");

const createOrder = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const {
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
    } = req.body;
    console.log(paymentId);

    // Validate required fields
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error("Invalid cart items");
    }

    if (!addressInfo || !addressInfo.addressId) {
      throw new Error("Address ID is required");
    }
    console.log(paymentId);

    // Create PayPal payment configuration
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:5173/shop/paypal-return",
        cancel_url: "http://localhost:5173/shop/paypal-cancel",
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId.toString(),
              price: parseFloat(item.price).toFixed(2),
              currency: "USD",
              quantity: parseInt(item.quantity),
            })),
          },
          amount: {
            currency: "USD",
            total: parseFloat(totalAmount).toFixed(2),
          },
          description: "Order payment",
        },
      ],
    };

    // Create PayPal payment
    const createPayPalPayment = () => {
      return new Promise((resolve, reject) => {
        paypal.payment.create(create_payment_json, (error, paymentInfo) => {
          if (error) reject(error);
          else resolve(paymentInfo);
        });
      });
    };

    const paymentInfo = await createPayPalPayment();
    const approvalURL = paymentInfo.links.find(
      (link) => link.rel === "approval_url"
    ).href;

    // Verify if address exists
    const [addressCheck] = await connection.execute(
      "SELECT addressId FROM address WHERE addressId = ?",
      [addressInfo.addressId]
    );

    if (!addressCheck.length) {
      throw new Error("Invalid address ID");
    }
    const orderdate = new Date().toISOString().slice(0, 19).replace("T", " "); // '2025-01-20T17:53:15.734Z'
    console.log(orderdate);
    const orderUpdatedate = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " "); // '2025-01-20T17:53:15.734Z'
    // Insert order with null checks for all fields
    console.log("userid: " + cartId);

    const [orderResult] = await connection.execute(
      `INSERT INTO Orders (
       userid ,cartID, addressId, orderStatus,paymentMethod,
        paymentStatus, totalAmount, orderDate, orderUpdateDate, 
        paymentId, payerId
      ) VALUES (?, ?,?,?, ?, ?, ?, ?, ?, ?,?)`,
      [
        userId || 1,
        cartId,
        addressInfo.addressId,
        orderStatus || "pending",
        paymentMethod || "paypal",
        paymentStatus || "pending",
        parseFloat(totalAmount) || 0,
        orderdate,
        orderUpdatedate,
        paymentId || 1,
        payerId || 2,
      ]
    );

    const orderId = orderResult.insertId;
    console.log(cartItems);

    // Insert order items
    const orderItemsPromises = cartItems.map((item) => {
      console.log(item.productId);

      connection.execute(
        `INSERT INTO OrderItems (
          orderId, productID, quantity, price, title
        ) VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.productId, item.quantity, item.price, item.title || ""]
      );
    });

    await Promise.all(orderItemsPromises);
    await connection.commit();

    res.status(201).json({
      success: true,
      approvalURL,
      orderId: orderId,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while creating order",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

module.exports = createOrder;
