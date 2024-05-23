const mongoose = require('mongoose');

const GioHangschema = mongoose.Schema({
    userId: {
        type: String,
    },
    danhSach: [{
        sach: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'sanPham'
        },
        soLuong: {
            type: Number,
            default: 1
        },
        thanhTien: {
            type: Number,
            default: 0,
        },
    }],
    tongGia: {
        type: Number,
        default: 0
    }
})

const GioHangModel = mongoose.model("gioHang", GioHangschema);

module.exports = GioHangModel;