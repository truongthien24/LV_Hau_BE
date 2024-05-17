const GiamGia = require("../models/GiamGia");
const Sach = require("../models/Sach");

const getAllGiamGia = async (req, res) => {
  try {
    const GiamGias = await GiamGia.find({});
    return res.status(200).json({ data: GiamGias });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const createGiamGia = async (req, res) => {
  const { phanTramGiamGia, tenMaGiamGia } = req.body;
  try {
    let ten = tenMaGiamGia.trim();
    let ten1 = ten.replace(/\s+/g, " ");
    const checkTrung = await GiamGia.findOne({
      tenMaGiamGia: {
        $regex: ten1,
        $options: "i",
      },
    });
    console.log(checkTrung);
    if (checkTrung?._id) {
      res.status(400).json({
        error: {
          message: "Tên mã giảm giá đã tồn tại",
        },
      });
    } else {
      const giamGia = await GiamGia.create({ phanTramGiamGia, tenMaGiamGia });
      res.status(200).json({ message: "Thêm thành công", data: giamGia });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};

///params
const updateGiamGia = async (req, res) => {
  const { id } = req.params;
  const { tenMaGiamGia } = req.body;
  let ten = tenMaGiamGia.trim();
  let ten1 = ten.replace(/\s+/g, " ");
  const giamGia = await GiamGia.findOne({ _id: id });
  const checkTrung = await GiamGia.findOne({
    tenMaGiamGia: {
      $regex: ten1,
      $options: "i",
    },
  });
  // Check trùng
  if (checkTrung) {
    if (checkTrung?._id?.toString() === id) {
      // if (tenTrim === tacGia.tenTacGia) {
      //   return res
      //     .status(400)
      //     .json({ error: { message: "Tên tác giả đã tồn tại" } });
      // }
      const giamGiaUpdate = await GiamGia.findOneAndUpdate(
        { _id: id },
        { ...req.body }
      );
      if (!giamGiaUpdate) {
        return res.status(400).json({
          error: {
            message: "Tên mã giảm giá không tồn tại",
          },
        });
      } else {
        res.status(200).json({ data: giamGia, message: "Cập nhật thành công" });
      }
    } else {
      return res.status(400).json({
        error: {
          message: "Tên mã giảm giá đã tồn tại",
        },
      });
    }
  } else {
    if (ten1.toUpperCase() === giamGia.tenMaGiamGia.toUpperCase()) {
      return res
        .status(400)
        .json({ error: { message: "Tên mã giảm giá đã tồn tại" } });
    }
    const giamGiaUpdate = await GiamGia.findOneAndUpdate(
      { _id: id },
      { ...req.body, tenMaGiamGia: ten1 }
    );
    if (!giamGiaUpdate) {
      return res.status(400).json({
        error: {
          message: "Tên mã giảm giá không tồn tại",
        },
      });
    } else {
      res.status(200).json({ data: giamGia, message: "Cập nhật thành công" });
    }
  }
};

const deleteGiamGia = async (req, res) => {
  const { id } = req.params;
  const sach = await Sach.findOne({ giamGia: id });
  if (sach) {
    return res.status(400).json({
      error: {
        message: "Sách đang sử dụng mã giảm giá này",
      },
    });
  } else {
    const giamGia = await GiamGia.findOneAndDelete({ _id: id });
    if (!giamGia) {
      return res.status(400).json({ error: "Mã giảm giá không tồn tại" });
    }
    res.status(200).json({ data: giamGia, message: "Xoá thành công" });
  }
};

const getGiamGiaByID = async (req, res) => {
  const { id } = req.params;
  try {
    const giamGia = await GiamGia.findOne({ _id: id });
    res.status(200).json({ data: giamGia, message: "Lấy thành công" });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

module.exports = {
  getAllGiamGia,
  createGiamGia,
  updateGiamGia,
  deleteGiamGia,
  getGiamGiaByID,
};
