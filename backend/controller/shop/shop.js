const promisePool = require("../../db.js");
const getfilteredProducts = async (req, res) => {
  try {
    const { category = "", brand = "", sortBy } = req.query;
    // const { sortByParams} = req.params;
    // console.log(sortByParams);
    console.log(sortBy);
    console.log(req.query);

    const lowercaseBrand = brand
      ? brand
          .split(",")
          .map((b) => b.toLowerCase().trim())
          .filter(Boolean)
      : [];
    const lowercaseCategory = category
      ? category
          .split(",")
          .map((c) => c.toLowerCase().trim())
          .filter(Boolean)
      : [];

    let query = "SELECT * FROM productsAdmin";
    const queryParams = [];
    const conditions = [];

    if (lowercaseCategory.length > 0) {
      conditions.push(
        `LOWER(cat) IN (${lowercaseCategory.map(() => "?").join(",")})`
      );
      console.log(conditions);

      queryParams.push(...lowercaseCategory);
    }

    if (lowercaseBrand.length > 0) {
      conditions.push(
        `LOWER(brand) IN (${lowercaseBrand.map(() => "?").join(",")})`
      );
      console.log(conditions);
      queryParams.push(...lowercaseBrand);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

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

    const [products] = await promisePool.execute(query, queryParams);

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

module.exports = { getfilteredProducts };
