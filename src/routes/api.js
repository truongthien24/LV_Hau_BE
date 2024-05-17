const express = require("express");
const {
  postCreateTaiKhoan,
  getAllTaiKhoan,
  loginTaiKhoan,
  loginAdmin,
  updateTaiKhoan,
  getAccountByID,
  forgetPassword,
  changePassword,
  getTaiKhoanByField,
} = require("../controller/taiKhoan.controller");
const TaiKhoan = require("../models/TaiKhoan");
const File = require("../models/File");
const { paymentOnline } = require("../utils/paymentOnline");
const {
  getAllGioHang,
  getGioHangByID,
  updateGioHang,
  checkSanPham,
  sendMailGioHang,
  deleteSanPhamKhoiGioHang,
} = require("../controller/gioHang.controller");
const {
  getAllGiamGia,
  createGiamGia,
  updateGiamGia,
  deleteGiamGia,
  getGiamGiaByID,
} = require("../controller/giamGia.controller");
const {
  getAllDonHang,
  createDonHang,
  updateDonHang,
  deleteDonHang,
  getDonHangByID,
} = require("../controller/donHang.controller");
const router = express.Router();

// Tài khoản
router.post("/create-taiKhoan", postCreateTaiKhoan);
router.get("/getAllTaiKhoan", getAllTaiKhoan);
router.post("/login", loginTaiKhoan);
router.post("/login-admin", loginAdmin);
router.patch("/updateTaiKhoan", updateTaiKhoan);
router.post("/getTaiKhoanByField", getTaiKhoanByField);
router.get("/getAccountByID/:id", getAccountByID);
router.post("/getPasswordByEmail", forgetPassword);
router.post("/changePassword", changePassword);
router.get("/taiKhoan/:id/verify/:token", async (req, res) => {
  try {
    const taiKhoan = await TaiKhoan.findOne({ _id: req.params.id });
    if (!taiKhoan) {
      return res.status(400).send({ message: "Invalid link" });
    }

    await TaiKhoan.updateOne({ _id: taiKhoan._id }, { xacThucEmail: true });
    // await Token.remove();

    res.status(200).send({ message: "Email verify successfully" });
  } catch (error) {
    res.status(400).send({ error });
  }
});

// File
router.post("/uploads", async (req, res) => {
  const body = req.body;
  try {
    const newImage = await File.create(body);
    if (newImage) {
      res.status(200).json({ data: newImage, message: "success" });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;


// Thanh toán
router.post("/thanhToan", paymentOnline);

// Giỏ hàng
router.get("/getAllGioHang", getAllGioHang);
router.patch("/updateGioHang/:id", updateGioHang);
router.get("/getGioHangByID/:id", getGioHangByID);
router.post("/checkSanPham", checkSanPham);
router.post("/sendMailGioHang", sendMailGioHang);
router.delete("/deleteSanPhamKhoiGioHang/:id", deleteSanPhamKhoiGioHang);

/// Đơn hàng
router.post("/getAllDonHang", getAllDonHang);
router.post("/createDonHang", createDonHang);
router.patch("/updateDonHang/:id", updateDonHang);
router.delete("/deleteDonHang/:id", deleteDonHang);
router.get("/getDonHangByID/:id", getDonHangByID);

// giảm giá
router.get("/getAllGiamGia", getAllGiamGia);
router.post("/createGiamGia", createGiamGia);
router.patch("/updateGiamGia/:id", updateGiamGia);
router.delete("/deleteGiamGia/:id", deleteGiamGia);
router.get("/getGiamGiaByID/:id", getGiamGiaByID);
