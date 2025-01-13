const promisePool = require("../../db.js");
const getfilteredProducts = async (req, res) => {
  try {
    const q = "SELECT * FROM productsAdmin";
    const [Data] = await promisePool.execute(q);
    //console.log(res);
    // res.status(200).json({ sucess: true, data: res });
    return res.status(200).json({ sucess: true ,data : Data});
  } catch (error) {
    console.log(error);
    res.status(500).json({ sucess: false, message: "Internal Server Error" });
  }
};
module.exports = { getfilteredProducts };
