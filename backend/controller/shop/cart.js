const promisePool = require("../../db.js");
const addtocart = async (req, res) => {
  try {
    const { productDetails, quantity ,userid } = req.body;
    const {
      productID,
      price,
      brand,
      image,
      title,
      desc,
      salePrice,
      totalStock,
    } = productDetails;
    // console.log(productDetails);
//console.log(userid);

    // const userid = productDetails.user.userid;
    //console.log(userid);
    if (!userid) {
      return res
        .status(402)
        .json({ message: "user id is required", sucess: false });
    }

    //  console.log(productDetails, userID, quantity);
    if (!productDetails || !quantity) {
      console.log("quantity " + quantity, productDetails);
      return res
        .status(401)
        .json({ message: "some fields are required ", sucess: false });
    }

    // console.log("quantity " + quantity);
    const q1 = "SELECT * FROM cart WHERE userID = ?";
    const [cartItems] = await promisePool.execute(q1, [userid]);
    //console.log(response1);

    const existingProduct = cartItems.find(
      (item) => item.productID === productID
    );

    if (existingProduct) {
      const q =
        "UPDATE cart SET quantity = quantity + 1 WHERE userID = ? AND productId = ?";

      const [response] = await promisePool.execute(q, [userid, productID]);

      // console.log(response);
      return res
        .status(200)
        .json({ message: "product qauntity updated in cart", sucess: true });
    } else {
      const q2 =
        "INSERT INTO cart (userID, productID, price, brand, image, title, `desc`,  salePrice, totalStock, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      const [response2] = await promisePool.execute(q2, [
        userid,
        productID,
        price,
        brand,
        image,
        title,
        desc,
        salePrice,
        totalStock,
        quantity,
      ]);
      console.log(response2);

      // add the funtionality to check if the product is already in the cart and if it is, then update the quantity and price of the product in the cart and if it is not, then add the product to the cart
      if (response2.affectedRows >= 1) {
        return res
          .status(200)
          .json({ message: "product added to cart", sucess: true });
      }
      return res
        .status(401)
        .json({ message: "product not added", sucess: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Inte  rnal Server Error", sucess: false });
  }
};

const fetchCartDetails = async (req, res) => {
  try {
    const { userID } = req.params;
    console.log("details ", userID);

    if (!userID) {
      return res
        .status(402)
        .json({ message: "userID is required", sucess: false });
    }
    const q = "SELECT * FROM cart WHERE userID = ?";
    const [response] = await promisePool.execute(q, [userID]);
   // console.log(response);
    if (response.length > 0) {
      return res
        .status(200)
        .json({ message: "cart details", data: response, sucess: true });
    }
    return res
      .status(401)
      .json({ message: "product not found", sucess: false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", sucess: false });
  }
};

// const updateQuantity = async (req, res) => {
//   try {
//     const { quantity } = req.body;
//     const { user, product } = req.body.productDetails;

//     const { userID } = user;
//     const { productID } = product;
//     if (!userID || !productID || !quantity) {
//       return res
//         .status(404)
//         .json({ message: "All fields are required", sucess: false });
//     }

//     const q =
//       "UPDATE cart SET quantity = quantity + 1 WHERE userID = ? AND productId = ?";

//     const [response] = await promisePool.execute(q, [userID, productID]);
//     if (response.affectedRows > 0) {
//       return res
//         .status(200)
//         .json({ message: "Quantity updated", sucess: true });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error", sucess: false });
//   }
// };

const deleteProduct = async (req, res) => {
  try {
    const { userID, productID } = req.params;
    console.log(userID, productID);

    const q = "DELETE FROM cart WHERE userID = ? AND productId = ?";
    const [response] = await promisePool.execute(q, [userID, productID]);
    if (response.affectedRows > 0) {
      console.log(response);
      return res
        .status(200)
        .json({ message: "Product deleted from cart", sucess: true });
    }
    return res
      .status(404)
      .json({ message: "Product not found", sucess: false });
  } catch (error) {
    console.log(error);
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { userid, productID, action, quantity } = req.body;
    // console.log(req.body);
    console.log(userid, productID, action, quantity);

    if (!userid || !productID || !action) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const q1 = "SELECT quantity FROM cart WHERE userID = ? AND productId = ?";

    const [fetchQuantity] = await promisePool.execute(q1, [userid, productID]);

   // console.log(fetchQuantity);
    if (fetchQuantity.length === 0) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    const currentQuantity = fetchQuantity[0].quantity;
   // console.log(currentQuantity);

    if (currentQuantity >= 1) {
      let updateQuery;
      if (action === "plus") {
        updateQuery =
          "UPDATE cart SET quantity = quantity + 1 WHERE userID = ? AND productId = ?";
      } else if (action === "minus" && currentQuantity > 1) {
        updateQuery =
          "UPDATE cart SET quantity = quantity - 1 WHERE userID = ? AND productId = ? AND quantity > 1";
      } else {
        return res.status(400).json({
          message: "Invalid action or quantity cannot be less than 1",
          success: false,
        });
      }
      const [updateResponse] = await promisePool.execute(updateQuery, [
        userid,
        productID,
      ]);

      if (updateResponse.affectedRows > 0) {
        const q3 = "SELECT * FROM cart WHERE userID = ? AND productId = ?";
        const [response3] = await promisePool.execute(q3, [userid, productID]);
      //  console.log(response3);

        return res.status(200).json({
          message: "Quantity updated",
          sucess: true,
          data: response3,
        });
      } else {
        return res
          .status(403)
          .json({ message: "Quantity cannot be less than 1" });
      }
    }
    // if (currentQuantity === 1) {
    //   const q = "DELETE FROM cart WHERE userID = ? AND productId = ?";
    //   const [response] = await promisePool.execute(q, [userid, productID]);
    //   console.log(response);
    //   return res.status(200).json({ message: "Product removed from cart" });
    // }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", sucess: false });
  }
};

module.exports = { addtocart, fetchCartDetails, updateQuantity, deleteProduct };
