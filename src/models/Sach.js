const mongoose = require("mongoose");

const SachSchema = mongoose.Schema({
  tenSach: {
    type: String,
    required: true,
  },
  nhaCungCap: {
    type: mongoose.Schema.Types.ObjectId,
    // mongoose.Schema.Types.ObjectId tự nối đến collection có _id bằng nhà cung cấp
    // type: String,
    required: true,
    /// ref trỏ tới nhà cung cấp
    ref: "nhaCungCap",
  },
  noiDung: {
    type: String,
    required: true,
  },
  theLoai: [
    {
      theLoai: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "theLoai",
      }
    },
  ],
  soLuong: {
    type: Number,
    required: true,
  },
  maSach: {
    type: String,
    required: true,
  },
  tacGia: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "tacGia",
  },
  gia: {
    type: Number,
    required: true,
  },
  nhaXuatBan: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "nhaXuaBan",
  },
  namXuatBan: {
    type: String,
    required: true,
  },
  tienCoc: {
    type: Number,
    required: true,
  },
  tinhTrang: {
    type: String,
    required: true,
  },
  hinhAnh: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  kichThuoc: {
    type: String,
    required: true,
  },
  soTrang: {
    type: Number,
    required: true,
  },
  ngonNgu: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "ngonNgu",
  },
  quocGia: {
    type: String,
    required: true,
  },
  biaSach: {
    type: String,
    required: true,
  },
  danhSachMaGiam: [
    {
      maGiam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "maGiam",
      },
    },
  ],
  danhGia: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "danhGia",
    },
  ],
});

const SachModel = mongoose.model("sach", SachSchema);

module.exports = SachModel;
