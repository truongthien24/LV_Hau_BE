const cloudinary = require("cloudinary");
const uuid = require("uuid");

cloudinary.config({
  cloud_name: "dw8znavtx",
  api_key: "822598955963446",
  api_secret: "yVvUWrDUVNvpswudLD5r8oe7a58",
});

const uploadToCloudinary = async (file, folder, imagePublicId) => {
  return await cloudinary.uploader.upload(file, {
    folder: folder,
  });
};

module.exports = { uploadToCloudinary };
