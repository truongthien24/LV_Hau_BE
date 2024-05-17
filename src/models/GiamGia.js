const mongoose = require("mongoose");

const giamGiaschema = mongoose.Schema({
  phanTramGiamGia: {
    type: Number,
    required: true,
  },

  tenMaGiamGia: {
    type: String,
    required: true,
  },

});

const GiamGiaModel = mongoose.model("giamGia", giamGiaschema);

module.exports = GiamGiaModel;
