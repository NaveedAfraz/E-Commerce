const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: "dvntoejlv",
  api_key: "963321585926651",
  api_secret: "syluKjUOQ2z1_XIj0IVA6d2Zxh4",
  secure: true,
});

const storage = multer.memoryStorage();

const ImageUpload = async (file) => {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return result;
};

const upload = multer({ storage: storage });

module.exports = { upload, ImageUpload };
