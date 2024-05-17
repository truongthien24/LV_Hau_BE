const mongoose = require("mongoose");

const TaiKhoanSchema = new mongoose.Schema({
  tenDangNhap: {
    type: String,
    required: true,
  },
  email: String,
  matKhau: {
    type: String,
    required: true,
  },
  loaiTaiKhoan: { type: String, required: true },
  // thongTinNhanHang: {
  //   tenKhachHang: { type: String },
  //   soDienThoai: { type: Number },
  //   diaChi: { type: String },
  //   type: Array,
  // },
  thongTinNhanHang: [
    {
      thongTinNhanHang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "thongTinNhanHang",
      },
    },
  ],
  gioHang: String,
  danhSachYeuThich: [
    {
      sach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sach",
      },
    },
  ],
});

const TaiKhoanModel = mongoose.model("taiKhoan", TaiKhoanSchema);

module.exports = TaiKhoanModel;
