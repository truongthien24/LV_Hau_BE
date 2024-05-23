const mongoose = require("mongoose");

const SanPhamSchema = mongoose.Schema({
  tenSanPham: {
    type: String,
    required: true,
  },
  moTa: {
    type: String,
    required: true,
  },
  thongSo: {
    type: String,
  },
  soLuong: {
    type: Number,
    required: true,
  },
  hinhAnh: {
    type: String,
    required: true,
  },
  gia: {
    type: Number,
    required: true,
  },
  namSanXuat: {
    type: String,
    required: true,
  },
  tinhTrang: {
    type: Number,
    required: true,
  },
  loaiSanPham: {
    type: Number,
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
  // thuongHieu: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "thuongHieu",
  // },
  danhSachKhuyenMai: [
    {
      khuyenMai: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "maGiam",
      },
    },
  ],
});

const SanPhamModel = mongoose.model("sanPham", SanPhamSchema);

module.exports = SanPhamModel;
