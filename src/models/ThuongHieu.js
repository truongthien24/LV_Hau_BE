const mongoose = require("mongoose");

const ThuongHieuSchema = new mongoose.Schema({
  tenThuongHieu: {
    type: String,
    required: true,
  },
  tinhTrang: {
    type: Number,
    required: true,
  },
});

const ThuongHieuModel = mongoose.model("thuongHieu", ThuongHieuSchema);

module.exports = ThuongHieuModel;
