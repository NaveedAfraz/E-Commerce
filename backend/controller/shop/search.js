const pool = require("../../db");
const SearchByKeyword = async (req, res) => {
  const { keyword } = req.params;
  console.log(keyword);

  if (!keyword) {
    console.log("Keyword is missing");
    return res.status(400).json({ error: "Keyword is missing" });
  }
  try {
    const q = `
    SELECT * FROM productsAdmin 
    WHERE title LIKE ? OR \`desc\` LIKE ? OR cat LIKE ? OR brand LIKE ?
  `;

    // Use the keyword for all columns
    const searchParam = `%${keyword}%`;
    const [data] = await pool.execute(q, [
      searchParam,
      searchParam,
      searchParam,
      searchParam,
    ]);
    console.log(data);
    if (data.length === 0) {
      console.log("No products found");
      return res.status(404).json({ error: "No products found" });
    }
    return res.status(200).json({
      success: true,
      data: data,
      message: "Products found successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { SearchByKeyword };
