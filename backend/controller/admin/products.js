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
    averageReview,
  } = req.body;
  console.log(req.body);
  try {
    const q =
      "INSERT INTO products (image, title, desC, cat, brand, price, salePrice, totalStock, averageReview) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const values = [
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    ];

    const [rows] = await promisePool.execute(q, values);
    console.log(rows);
    if (rows.affectedRows === 1) {
      res.status(200).json({
        success: true,
        message: "Product added successfully",
        data: rows,
      });
    }
    return res.status(404).json({
      success: false,
      message: "Product not added",
    });
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
  try {
    const { id } = req.params;
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

    const q = "SELECT * FROM products WHERE id = ?";
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
        description,
        category,
        brand,
        price,
        salePrice,
        totalStock,
        averageReview,
      ];

      const q2 =
        "UPDATE products SET image = ?, title = ?, desc = ?, cat = ?, brand = ?, price = ?, salePrice = ?, totalStock = ?, averageReview = ? WHERE id = ?";

      const [rows2] = await promisePool.execute(q2, [values, id]);
      if (rows2.affectedRows > 0) {
        return res
          .status(200)
          .json({ success: true, message: "Product updated successfully" });
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

    const q = "DELETE FROM products WHERE id = ?";
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
