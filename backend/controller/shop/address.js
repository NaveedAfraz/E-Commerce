const promisePool = require("../../db");
const fetchAllAddress = async (req, res) => {
  try {
    const { userID } = req.params;
    console.log(userID);

    if (!userID) {
      console.log("userId is missing");
      return res.status(401).json({ message: "userId is missing" });
    }
    const q = "SELECT * FROM address WHERE userId = ?";
    const [rows] = await promisePool.execute(q, [userID]);
    if (rows.length === 0) {
      console.log("No address found");
      return res
        .status(404)
        .json({ success: false, message: "No address found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "found address", data: rows });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "fetching error" });
  }
};

const DeleteAddress = async (req, res) => {
  try {
    const { userID, addressID } = req.params;
    console.log(userID, addressID);

    if (!userID || !addressID) {
      console.log("userId or addressID is missing");
      return res
        .status(404)
        .json({ success: false, message: "userId or addressID is missing" });
    }
    const q = "DELETE FROM address WHERE userId = ? AND addressID = ?";
    const [data] = await promisePool.execute(q, [userID, addressID]);
    if (data.affectedRows === 1) {
      console.log("address deleted successfully");
      return res
        .status(200)
        .json({ success: true, message: "address deleted successfully" });
    }
    console.log("address not found");
    return res
      .status(404)
      .json({ success: false, message: "address not found and not deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "fetching error" });
  }
};

const EditAddress = async (req, res) => {
  try {
    const { userID } = req.params;
    const { addressData } = req.body;

    const addressID = addressData.addressID;
    // console.log(userID, addressID, addressData);

    if (!userID || !addressID || !addressData) {
      console.log("userId or addressID or address is missing");
      return res.status(404).json({
        success: false,
        message: "userId or addressID or address is missing",
      });
    }
    const values = [
      addressData.address,
      addressData.city,
      addressData.pincode,
      addressData.phoneNO,
      addressData.notes,
    ];
    console.log(values, userID, addressID);
    console.log(addressData.phoneNO);

    const q =
      "UPDATE address SET address = ?, city = ?, pincode = ?, phoneNO = ?, notes = ? WHERE userId = ? AND addressID = ?";

    const [data] = await promisePool.execute(q, [...values, userID, addressID]);
    if (data.affectedRows === 1) {
      console.log("address updated successfully");
      return res
        .status(200)
        .json({ success: true, message: "address updated successfully" });
    }
    console.log("address not found");
    return res
      .status(404)
      .json({ success: false, message: "address not found and not updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "fetching error" });
  }
};

const AddAddress = async (req, res) => {
  try {
    const { userID, addressData } = req.body;
    console.log(userID, addressData);

    if (!userID || !addressData) {
      console.log("address or userId is missing");
      return res.status(402).json({ message: "address or userId is missing" });
    }
    const { phoneNO, pincode } = addressData;
    console.log(phoneNO, pincode);

    const convertedPhone = parseInt(phoneNO, 10);
    const convertedPincode = parseInt(pincode, 10);

    const values = [
      userID,
      addressData.address,
      addressData.city,
      convertedPhone,
      convertedPincode,
      addressData.notes,
    ];

    console.log(values);

    const q =
      "INSERT INTO address (userId, address,city,pincode,phoneNO,notes) VALUES (?, ?,?,?,?,?)";
    const [data] = await promisePool.execute(q, values);

    if (data.affectedRows === 1) {
      console.log("address added successfully");
      return res
        .status(200)
        .json({ success: true, message: "address added successfully" });
    }
    return res
      .status(401)
      .json({ success: false, message: "address not added" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "fetching error" });
  }
};

module.exports = { fetchAllAddress, DeleteAddress, EditAddress, AddAddress };
