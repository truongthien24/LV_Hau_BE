const GioHang = require("../models/GioHang");
const Sach = require("../models/Sach");
const { json } = require("body-parser");
const sendEmailPaymentSuccess = require("../utils/sendEmailPaymentSuccess");

const getAllGioHang = async (req, res) => {
  try {
    const gioHangs = await GioHang.find({});
    return res.status(200).json({ data: gioHangs });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

// Lấy một tác giả
const getGioHangByID = async (req, res) => {
  const { id } = req.params;
  try {
    const gioHang = await GioHang.findOne({ _id: id }).populate(
      "danhSach.sach"
    );
    res.status(200).json({ data: gioHang, message: "Lấy thành công" });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

// Thêm, chỉnh sửa giỏ hàng
const updateGioHang = async (req, res) => {
  const { id, sach, insert = false, update = false } = req.body;
  try {
    let gioHangOld = await GioHang.findOne({ _id: id }).populate(
      "danhSach.sach"
    );
    if (!gioHangOld) {
      return res
        .status(400)
        .json({ error: { message: "Không tìm thấy giỏ hàng" } });
    } else {
      // Kiểm tra xem insert sách mới hay update số lượng sách
      if (insert) {
        // Kiểm tra sách cũ trong giỏ hàng có tồn tại hay không
        // const checkSach = gioHangOld.findOne
        const index = gioHangOld?.danhSach?.findIndex(
          (s) => s.sach._id.toString() === sach.idSach
        );
        let tongGia = 0;
        // Nếu không tồn tại thì thêm sách vào
        if (index === -1) {
          gioHangOld.danhSach.push({
            sach: sach?.idSach,
            soLuong: sach?.soLuong,
            soNgayThue: sach?.soNgayThue,
            giaThue: sach?.giaThue,
            tienCoc: sach?.tienCoc,
          });
          tongGia = gioHangOld?.danhSach?.reduce(
            (a, b) => a + b?.tienCoc * b?.soLuong + b?.giaThue * b?.soLuong,
            0
          );
        }
        // Nếu tồn tại thì cộng số lượng
        else {
          gioHangOld.danhSach[index].soLuong += sach.soLuong;
          tongGia = gioHangOld?.danhSach?.reduce(
            (a, b) =>
              a + b?.sach?.tienCoc * b?.soLuong + b?.giaThue * b?.soLuong,
            0
          );
        }
        const gioHangNew = await GioHang.findOneAndUpdate(
          { _id: id },
          {
            danhSach: gioHangOld.danhSach,
            tongGia: tongGia,
          }
        );
        if (gioHangNew) {
          res.status(200).json({ message: "Thành công", data: gioHangNew });
        } else {
          return res.status(400).json({ error: { message: "Thất bại" } });
        }
      } else if (update) {
        const gioHangNew = await GioHang.findOneAndUpdate(
          { _id: id },
          {
            danhSach: sach,
            tongGia: sach?.reduce(
              (a, b) =>
                a + b?.sach?.tienCoc * b?.soLuong + b?.giaThue * b?.soLuong,
              0
            ),
          }
        );

        if (gioHangNew) {
          res.status(200).json({ message: "Thành công", data: gioHangNew });
        } else {
          return res.status(400).json({ error: { message: "Thất bại" } });
        }
      }
    }
  } catch (error) {
    return res.status(400).json({ error: { message: "Thất bại" } });
  }
};

// Xóa item khỏi giỏ hàng
const deleteSanPhamKhoiGioHang = async (req, res) => {
  const { id, idSach } = req.body;
  const gioHang = await GioHang.findOne({ _id: id });
  if (!gioHang) {
    return res.status(400).json({ error: "Giỏ hàng không tồn tại" });
  } else {
    const gioHangDanhSachNew = gioHang.danhSach.filter(
      (sach) => sach?.sach?._id != idSach
    );
    // const gioHangNew = await GioHang.findOneAndUpdate(
    //   { _id: id },
    //   {
    //     danhSach: gioHangDanhSachNew,
    //     tongGia: gioHangDanhSachNew?.reduce(
    //       (a, b) => a + b?.sach?.tienCoc * b?.soLuong + b?.giaThue * b?.soLuong,
    //       0
    //     ),
    //   }
    // );
    // if (gioHangNew) {
    res.status(200).json({ message: "Thành công", data: [] });
    // } else {
    //   return res.status(400).json({ error: { message: "Thất bại" } });
    // }
  }
};

// Check sản phẩm trước khi sang bước thanh toán
const checkSanPham = async (req, res) => {
  const { danhSach } = req.body;
  try {
    for (let sach of danhSach) {
      const check = await Sach.findOne({ _id: sach?.sach?._id });
      if (check) {
        if (check?.soLuong < sach?.soLuong) {
          return res.status(400).json({
            error: {
              message: `Sách ${check?.tenSach} chỉ còn ${check?.soLuong} cuốn không đủ số lượng bạn cần :((`,
            },
          });
        }
      } else {
        return res
          .status(400)
          .json({ error: { message: `Sách không tồn tại` } });
      }
    }
    res.status(200).json({ message: "Kiểm tra hoàn tất" });
  } catch (error) {
    return res.status(400).json({ error: { message: error } });
  }
};

const sendMailGioHang = async (req, res) => {
  await sendEmailPaymentSuccess(
    "truongthien2411@gmail.com",
    "Verify Email",
    req.body
  );
  return res.status(200).json({ message: "Thanh toán thành công" });
};

module.exports = {
  getAllGioHang,
  updateGioHang,
  getGioHangByID,
  checkSanPham,
  sendMailGioHang,
  deleteSanPhamKhoiGioHang,
};
