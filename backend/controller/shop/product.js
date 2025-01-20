const promisePool = require("../../db.js");
const getfilteredProducts = async (req, res) => {
  try {
    const { category, brand, sortBy } = req.query;
    // const { sortByParams} = req.params;
    // console.log(sortByParams);
    //console.log(sortBy);
    console.log(req.query);

    const lowercaseBrand = brand
      ? brand.split(",").map((b) => b.toLowerCase().trim())
      : [];
    const lowercaseCategory = category
      ? category.split(",").map((c) => c.toLowerCase().trim())
      : [];
    // console.log(lowercaseBrand);
    console.log(lowercaseCategory);
    console.log("run");

    let query = "SELECT * FROM productsAdmin";
    const queryParams = [];
    const conditions = [];

    if (lowercaseCategory.length > 0) {
      conditions.push(
        `LOWER(cat) IN (${lowercaseCategory.map(() => "?").join(",")})`
      );
      console.log(conditions);
      console.log("RUN2");

      queryParams.push(...lowercaseCategory);
    }

    if (lowercaseBrand.length > 0) {
      conditions.push(
        `LOWER(brand) IN (${lowercaseBrand.map(() => "?").join(",")})`
      );
      console.log("RUN3");
      console.log(conditions);
      queryParams.push(...lowercaseBrand);
    }

    if (conditions.length > 0) {
      console.log("RUN4");
      query += ` WHERE ${conditions.join(" AND ")}`;
    }
    console.log("RUN5");
    switch (sortBy) {
      case "price-lowtohigh":
        query += " ORDER BY price ASC";
        break;
      case "price-hightolow":
        query += " ORDER BY price DESC";
        break;
      case "title-atoz":
        query += " ORDER BY title ASC";
        break;
      case "title-ztoa":
        query += " ORDER BY title DESC";
        break;
      default:
        query += " ORDER BY price ASC";
    }
    console.log("RUN6");
    console.log(query);
    if (category == "Products") {
      const q = "SELECT * FROM productsAdmin";
      const [products] = await promisePool.execute(q);
      console.log(products);
      return res.status(200).json({
        success: true,
        count: products.length,
        data: products,
      });
    }
    const [products] = await promisePool.execute(query, queryParams);
    console.log(products);

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error in getfilteredProducts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const fetchDetails = async (req, res) => {
  try {
    //  console.log(req.params); // Check if id is present here

    const { id } = req.params;
    // console.log(id + "id");
    if (!id) {
      return res
        .status(404)
        .json({ success: false, message: "Product ID is required" });
    }
    const query = "SELECT * FROM productsAdmin WHERE productID = ?";
    const [result] = await promisePool.execute(query, [id]);
    console.log(result);

    if (result.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    if (result) {
      console.log("result" + result);

      return res.status(200).json({
        success: true,
        data: result,
        message: "Product details fetched successfully",
      });
    }
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  } catch (error) {
    console.error("Error in getfilteredProducts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { getfilteredProducts, fetchDetails };
