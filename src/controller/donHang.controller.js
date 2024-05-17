const { default: mongoose } = require("mongoose");
const DonHang = require("../models/DonHang");
const GioHang = require("../models/GioHang");
const Sach = require("../models/Sach");
const sendEmailPaymentSuccess = require("../utils/sendEmailPaymentSuccess");

const getAllDonHang = async (req, res) => {
  try {
    const { userId } = req.body;
    let DonHangs = [];
    if (mongoose.Types.ObjectId.isValid(userId)) {
      DonHangs = await DonHang.find({ userId: userId }).populate(
        "danhSach.sach"
      );
    } else {
      DonHangs = await DonHang.find({}).populate("danhSach.sach");
    }
    res.status(200).json({ data: DonHangs });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const createDonHang = async (req, res) => {
  const {
    userId,
    danhSach,
    thongTinGiaoHang,
    thongTinThanhToan,
    tongGia,
    email,
    gioHangId,
  } = req.body;
  try {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let maDon = "";

    for (let i = 0; i < 15; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      maDon += characters.charAt(randomIndex);
    }
    const danhSachThue = danhSach?.map((sach) => {
      return { ...sach, tinhTrang: false };
    });
    const donHang = await DonHang.create({
      userId,
      danhSach: danhSachThue,
      ngayTaoDon: new Date(),
      thongTinGiaoHang,
      thongTinThanhToan,
      tongGia,
      maDonHang: maDon,
      loTrinhDonHang: [],
      tinhTrang: 0,
    });

    if (donHang) {
      await sendEmailPaymentSuccess(email, "Đặt hàng thành công", donHang);
      for (let sach of danhSach) {
        const sachResult = await Sach.findOne({ _id: sach?.sach?._id });
        if (sachResult) {
          const soLuongNew = sachResult?.soLuong - sach?.soLuong;
          await Sach.findOneAndUpdate(
            { _id: sach?.sach?._id },
            { soLuong: soLuongNew }
          );
        } else {
          res.status("400").json({ error: { message: "Sach khong ton tai" } });
        }
      }
      await GioHang.findOneAndUpdate(
        { _id: gioHangId },
        { danhSach: [], tongGia: 0 }
      );
      res.status(200).json({ message: "Hoàn tất", data: donHang });
    } else {
      return res
        .status(400)
        .json({ error: { message: "Tạo đơn hàng không thành công" } });
    }
  } catch (error) {
    return res.status(400).json({ error: { message: "Lỗi server" } });
  }
};

const updateDonHang = async (req, res) => {
  const { id } = req.params;
  const { tinhTrang } = req.body;
  try {
    // switch(type) {
    //   case 1: {
    const donHang = await DonHang.findOneAndUpdate(
      { _id: id },
      {
        ...req.body,
        ...(tinhTrang === 2 && {
          thongTinThanhToan: { ...req.body.thongTinThanhToan, thanhToan: true },
        }),
      }
    );
    if (!donHang) {
      return res
        .status(400)
        .json({ error: { message: "Đơn hàng không tồn tại" } });
    } else {
      if (tinhTrang == 4 || tinhTrang == 5) {
        for (let sach of donHang?.danhSach) {
          const sachResult = await Sach.findOne({ _id: sach?.sach?._id });
          if (sachResult) {
            const soLuongNew = sachResult?.soLuong + sach?.soLuong;
            await Sach.findOneAndUpdate(
              { _id: sach?.sach?._id },
              { soLuong: soLuongNew }
            );
          } else {
            res
              .status("400")
              .json({ error: { message: "Sach khong ton tai" } });
          }
        }
      }
      res.status(200).json({ data: donHang, message: "Cập nhật thành công" });
    }
  } catch (err) {
    return res.status(500).json({ error: { message: "Lỗi hệ thống" } });
  }
};

const deleteDonHang = async (req, res) => {
  const { id } = req.params;

  const donHang = await DonHang.findOneAndDelete({ _id: id });

  if (!donHang) {
    return res.status(400).json({ error: "Bài viết không tồn tại" });
  }

  res.status(200).json({ data: donHang, message: "Xoá thành công" });
};

const getDonHangByID = async (req, res) => {
  const { id } = req.params;
  try {
    const donHang = await DonHang.findOne({ _id: id });
    res.status(200).json({ data: donHang, message: "Lấy thành công" });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

module.exports = {
  getAllDonHang,
  createDonHang,
  updateDonHang,
  deleteDonHang,
  getDonHangByID,
};
