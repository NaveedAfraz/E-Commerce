const promisePool = require("../../db.js");
const getfilteredProducts = async (req, res) => {
  const { category = "", brand = "", sortBy = "price-lowtohigh" } = req.query;

  try {
    const q = "SELECT * FROM productsAdmin";
    const [Data] = await promisePool.execute(q);

    if (category || brand || sortBy) {
      let q1 = "SELECT * FROM productsAdmin WHERE cat = ?";
      let queryParams = [category];

      if (brand) {
        const brands = brand.split(",");
        const brandPlaceholders = brands.map(() => "?").join(",");
        query += ` AND brand IN (${brandPlaceholders})`;
        queryParams.push(...brands);
      }
      const [data2] = await promisePool.execute(q1, queryParams);
      console.log(data2);
      return res.status(200).json({ sucess: true, data: data2 });
    } else {
      console.log(res);
      return res.status(200).json({ sucess: true, data: Data });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ sucess: false, message: "Internal Server Error" });
  }
};
module.exports = { getfilteredProducts };
