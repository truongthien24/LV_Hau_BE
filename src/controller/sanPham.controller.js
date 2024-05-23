const SanPham = require("../models/SanPham");
const mongoose = require("mongoose");
const { uploadToCloudinary } = require("../utils/uploadFileCloud");
const GioHang = require("../models/GioHang");
const DonHang = require("../models/DonHang");

const getAllSanPham = async (req, res) => {
  try {
    const sanPhams = await SanPham.find({})
      //populate lấy dữ liệu
    //   .populate({ path: "thuongHieu", model: "thuongHieu" });
    const result = await sanPhams?.map((sp) => {
      return {
        _id: sp._id,
        tenSanPham: sp.tenSanPham,
        // tenThuongHieu: sp?.thuongThieu?.tenThuongHieu,
        // maThuongHieu: sp?.thuongHieu?._id?.toString(),
        // tenTheLoai: sach?.theLoai?.tenTheLoai,
        // maTheLoai: sach?.theLoai?._id?.toString(),
        loaiSanPham: sp.loaiSanPham,
        soLuong: sp.soLuong,
        gia: sp.gia,
        namSanXuat: sp.namSanXuat,
        tinhTrang: sp.tinhTrang,
        hinhAnh: sp.hinhAnh,
      };
    });
    res.status(200).json({ data: result, message: "success" });
  } catch (error) {
    return res.status(400).json({
      error: {
        message: error,
      },
    });
  }
};

const findSanPham = async (req, res) => {
  const { tenSanPham } = req.body;
  let objectFind = {};
  if (tenSanPham) {
    objectFind.tenSanPham = tenSanPham;
  }

  try {
    const sanPhams = await SanPham.find({
      tenSanPham: { $regex: ".*" + tenSanPham + ".*", $options: "i" },
    })
    // .populate({ path: "thuongHieu", model: "thuongHieu" });
    const result = await sanPhams?.map((sp) => {
      return {
        _id: sp._id,
        tenSanPham: sp.tenSanPham,
        // tenThuongHieu: sp?.thuongThieu?.tenThuongHieu,
        // maThuongHieu: sp?.thuongHieu?._id?.toString(),
        loaiSanPham: sp.loaiSanPham,
        soLuong: sp.soLuong,
        gia: sp.gia,
        namSanXuat: sp.namSanXuat,
        tinhTrang: sp.tinhTrang,
        hinhAnh: sp.hinhAnh,
      };
    });
    res.status(200).json({ data: result, message: "success" });
  } catch (error) {
    return res.status(400).json({
      error: {
        message: error,
      },
    });
  }
};

const getSanPhamByID = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Không có data" });
    }
    const sanPham = await SanPham.findById(id)
    // .populate({
    //   path: "thuongHieu",
    //   model: "thuongHieu",
    // });
    if (!sanPham._id) {
      return res.status(400).json({ error: "Không có data" });
    }
    const result = {
      _id: sanPham._id,
      tenSanPham: sanPham.tenSanPham,
      tenThuongHieu: sanPham?.thuongThieu?.tenThuongHieu,
      maThuongHieu: sanPham?.thuongHieu?._id?.toString(),
      loaiSanPham: sanPham?.loaiSanPham,
      soLuong: sanPham.soLuong,
      gia: sanPham.gia,
      namSanXuat: sanPham.namSanXuat,
      tinhTrang: sanPham.tinhTrang,
      hinhAnh: sanPham.hinhAnh,
    };
    res.status(200).json({ data: result, message: "success" });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const createSanPham = async (req, res) => {
  const {
    tenSanPham,
    maSanPham,
    namSanXuat,
    soLuong,
    gia,
    moTa,
    loaiSanPham,
    tinhTrang,
    thuongHieu,
    hinhAnh,
  } = req.body;
  try {
    const checkTrung = await SanPham.findOne({ maSanPham });
    if (checkTrung?._id) {
      res.status(400).json({
        error: {
          message: "Sản phẩm đã tồn tại",
        },
      });
    } else {
      const uploadImage = await uploadToCloudinary(hinhAnh, "dienthoais");

      const sanPham = await SanPham.create({
        tenSanPham,
        maSanPham,
        namSanXuat,
        thuongHieu,
        loaiSanPham,
        soLuong,
        gia,
        moTa,
        tinhTrang,
        hinhAnh: {
          public_id: uploadImage.public_id,
          url: uploadImage.secure_url,
        },
      });
      res.status(200).json({ message: "Thêm thành công", data: sanPham });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const updateSanPham = async (req, res) => {
  const { id } = req.params;

  const { hinhAnh } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: { message: "Sản phẩm không tồn tại" } });
  }
  let image = {};

  if (hinhAnh?.public_id) {
    image = hinhAnh;
  } else {
    image = await uploadToCloudinary(req.body.hinhAnh.url, "dienthoais");
  }
  const sanPham = await SanPham.findOneAndUpdate(
    { _id: id },
    { ...req.body, hinhAnh: image }
  );

  if (!sanPham) {
    return res.status(400).json({ error: { message: "Sản phẩm không tồn tại" } });
  }

  res.status(200).json({ data: [], message: "Cập nhật thành công" });
};

const deleteSanPham = async (req, res) => {
  const { id } = req.params;

  // Step 1
  // Kiểm tra id có chính xác không
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: { message: "Sản phẩm không tồn tại" } });
  }

  // Step 2
  // Kiểm tra sách có đang được đặt hàng hay không
  const gioHang = await GioHang.findOne({ "danhSach.sanPham": id });
  if (gioHang) {
    return res.status(400).json({
      error: {
        message: "Sản phẩm này đang trong giỏ hàng",
      },
    });
  }
  // Kiểm tra sách có đang trong đơn hàng hay không
  const donHang = await DonHang.findOne({ "danhSach.sanPham._id": id });
  if (donHang) {
    return res.status(400).json({
      error: {
        message: "Sản phẩm này đang trong đơn hàng",
      },
    });
  }
  const sanPham = await SanPham.findOneAndDelete({ _id: id });

  if (!sanPham) {
    return res.status(400).json({ error: { message: "Sản phẩm không tồn tại" } });
  }

  res.status(200).json({ data: sanPham, message: "Xoá thành công" });
};

module.exports = {
  getAllSanPham,
  createSanPham,
  getSanPhamByID,
  updateSanPham,
  deleteSanPham,
  findSanPham,
};
