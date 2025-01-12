const { ImageUpload } = require("../../helper/image-upload");
const promisePool = require("../../db");
const sql = require("mysql2");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await ImageUpload(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "Error occured",
    });
  }
};

//add a product
const addProduct = async (req, res) => {
  const {
    image,
    title,
    description,
    category,
    brand,
    price,
    salePrice,
    totalStock,
  } = req.body;
  console.log(
    image,
    title,
    description,
    category,
    brand,
    price,
    salePrice,
    totalStock
    // averageReview
  );
  try {
    const q = `INSERT INTO productsAdmin (image, title, \`desc\`, cat, brand, price, salePrice, totalStock) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    ];

    const [rows] = await promisePool.execute(q, values);
    console.log(rows);
    if (rows.affectedRows === 1) {
      const Data = {
        image,
        title,
        description, // Map description correctly
        category,
        brand,
        price,
        salePrice,
        totalStock,
      };
      res.status(200).json({
        success: true,
        message: "Product added successfully",
        data: Data,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Product not added",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "Error occured",
    });
  }
};

//get all products
const fetchAllProducts = async (req, res) => {
  try {
    const [rows] = await promisePool.execute("SELECT * FROM productsAdmin");
    console.log(rows);

    if (rows.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: rows,
      });
    }
    return res.status(404).json({
      success: false,
      message: "No products found",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "Error occured",
    });
  }
};
//edit a prodcut
const editProduct = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    if (!id)
      return res
        .status(404)
        .json({ success: false, message: "No id provided" });

    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    const q = "SELECT * FROM productsAdmin WHERE ProductID = ?";
    const [rows] = await promisePool.execute(q, [id]);
    if (rows.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "No product found" });

    if (rows.length > 0) {
      console.log(rows);
      const values = [
        image,
        title,
        description, // Use description for 'desc'
        category, // Use category for 'cat'
        brand,
        price,
        salePrice,
        totalStock,
        averageReview,
      ];
      console.log(values);
      if (salePrice === "") values[6] = 0;
      if (averageReview === "") values[8] = 0;
      if (description === "") values[2] = "";

      const q2 =
        "UPDATE productsAdmin SET image = ?, title = ?, `desc` = ?, `cat` = ?, brand = ?, price = ?, salePrice = ?, totalStock = ?, averageReview = ? WHERE ProductID = ?";

      const [rows2] = await promisePool.execute(q2, [...values, id]);
      if (rows2.affectedRows > 0) {
        // console.log(rows2.changedRows) 
        const updatedProductQuery =
          "SELECT * FROM productsAdmin WHERE ProductID = ?";
        const [updatedProduct] = await promisePool.execute(
          updatedProductQuery,
          [id]
        );
        return res.status(200).json({
          success: true,
          message: "Product updated successfully",
          data: updatedProduct,
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "No product updated" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "Error occured",
    });
  }
};
//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(404)
        .json({ success: false, message: "No id provided" });

    const q = "DELETE FROM productsAdmin WHERE productID = ?";
    const [rows] = await promisePool.execute(q, [id]);

    if (rows.affectedRows > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Product deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "No product found" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "Error occured",
    });
  }
};
module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
