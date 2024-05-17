const mongoose = require('mongoose');

const DonHangschema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "taiKhoan",
    },
    danhSach: {
        type: Array,
    },
    ngayTaoDon: {
        type: Date,
    },
    ngayGiao: {
        type: Date
    },
    thongTinGiaoHang: {
        ngayNhanHangDuKien: {
            ngayBatDau: {
                type: String,
            },
            ngayKetThuc: {
                type: String,
            }
        },
        thongTinNguoiNhan: {
            tenNguoiNhan: {
                type: String,
            },
            diaChi: {
                type: String,
            },
            sdt: {
                type: String,
            },
        },
    },
    thongTinThanhToan: {
        phuongThucThanhToan: {
            type: String,
        },
        viThanhToan: {
            type: String,
        },
        thanhToan: {
            type: Boolean
        }
    },
    thongTinTraHang: {
        ngayBatDau: {
            type: String,
        },
        ngayKetThuc: {
            type: String
        }
    },
    tongGia: {
        type: Number,
        default: 0,
    },
    maDonHang: {
        type: String,
    },
    loTrinhDonHang: {
        type: Array,
        default: [],
    },
    tinhTrang: {
        type: Number,
        default: 0
    }
})

const DonHangModel = mongoose.model("donHang", DonHangschema);

module.exports = DonHangModel;