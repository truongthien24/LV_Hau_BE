const TaiKhoan = require("../models/TaiKhoan");
const jwt = require("jsonwebtoken");
const token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const GioHang = require("../models/GioHang");
const { default: mongoose } = require("mongoose");
const { hashPassword } = require("../utils/function");
const bcrypt = require("bcryptjs");
const sendEmailForgetPassword = require("../utils/sendEmailForgetPassword");

const getAllTaiKhoan = async (req, res) => {
  try {
    const users = await TaiKhoan.find({});
    res.status(200).json({data: users, message: 'Lấy thành công'});
  } catch (error) {
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

const getTaiKhoanByField = async (req, res) => {
  try {
    const {tenDangNhap, loaiTaiKhoan, email = ""} = req.body.Data;
    console.log(req.body.Data)
    const users = await TaiKhoan.find(
      
      {
        ...tenDangNhap && ({tenDangNhap: { $regex: ".*" + tenDangNhap + ".*", $options: "i" }}),
        ...loaiTaiKhoan && ({loaiTaiKhoan: loaiTaiKhoan}),
        ...email && ({email: { $regex: ".*" + email + ".*", $options: "i" }})
      },
    );
    res.status(200).json({data: users, message: 'Lấy thành công'});
  } catch (error) {
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
}

const getAccountByID = async (req, res) => {
  const { id } = req.params;
  try {
    const account = await TaiKhoan.findOne({ _id: id });
    if (account) {
      res.status(200).json({
        data: account,
        message: "Lấy thành công",
      });
    } else {
      return res.status(400).json({
        data: {},
        message: "Tài khoản không tồn tại",
      });
    }
  } catch (err) {
    return res.status(400).json({
      data: {},
      message: err,
    });
  }
};

const loginTaiKhoan = async (req, res) => {
  const { tenDangNhap, matKhau } = req?.body;
  try {
    const users = await TaiKhoan.findOne({ tenDangNhap });
    if (!users) {
      return res.status(400).json({
        error: { message: "Tên đăng nhập không tồn tại" },
      });
    }
    if (users) {
      // dùng thư viện bcrypt để mã hóa với so sánh mật khẩu.
      const checkPassword = await bcrypt.compareSync(matKhau, users?.matKhau);
      if (checkPassword) {
        if (
          users.loaiTaiKhoan === "admin" ||
          users.loaiTaiKhoan === "employee"
        ) {
          return res.status(400).send({
            error: { message: "Tài khoản không được cấp quyền" },
          });
        }
        if (users.xacThucEmail) {
          const id = users?._id;
          // Đăng ký token để sử dụng api
          const token = jwt.sign(
            { users },
            "secret",
            { expiresIn: "24h" },
            "9359AF90D36CEC62F9522CE3394E8E2E335DF77983E8F9D9AC77C10D09D3074C"
          );
          // Thành công trả về status 200 và message
          return res.status(200).json({
            Success: true,
            token,
            Data: {
              tenDangNhap: users?.tenDangNhap,
              email: users?.email,
            },
            Message: "Đăng nhập thành công",
          });
        } else {
          return res.status(400).send({
            error: {
              message: "Tài khoản chưa được xác thực email",
            },
          });
        }
      } else {
        res
          .status(400)
          .json({ error: { message: "Mật khẩu không chính xác" } });
      }
    } else {
      res.status(400).json({ error: { message: "Tài khoản không tồn tại" } });
    }
  } catch (error) {
    res.status(400).json({ error: { message: "Lỗi hệ thống" } });
  }
};

const postCreateTaiKhoan = async (req, res) => {
  const { tenDangNhap, matKhau, email, loaiTaiKhoan } = req?.body;
  try {
    // Check trùng
    let ten = tenDangNhap.trim();
    let ten1 = ten.replace(/\s+/g, " ");
    const checkTrungTenDangNhap = await TaiKhoan.findOne({
      tenDangNhap: {
        $regex: ten1,
        $options: "i",
      },
    });
    if (/\s/.test(tenDangNhap)) {
      return res.status(400).json({
        error: { message: "Tên đăng nhập không được chứa dấu cách" },
      });
    }
    if (/\s/.test(matKhau)) {
      return res.status(400).json({
        error: { message: "Mật khẩu không được chứa dấu cách" },
      });
    }
    const isPasswordValid = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/.test(
      matKhau
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        error: {
          message:
            "Mật khẩu không hợp lệ. Phải bắt đầu bằng chữ cái viết hoa và chứa ít nhất một ký tự đặc biệt.",
        },
      });
    }
    const checkTrungEmail = await TaiKhoan.findOne({ email });
    // if (checkTrungTenDangNhap?._id) {
    //   res.status(400).json({
    //     error: {
    //       message: "Tên đăng nhập đã tồn tại",
    //     },
    //   });
    // } else if (checkTrungEmail?._id) {
    //   res.status(400).json({
    //     error: {
    //       message: "Email đã tồn tại",
    //     },
    //   });
    // } else {
    //   // const hashPassword = ""

    //   const gioHang = await GioHang.create({
    //     danhSach: [],
    //   });
    //   const hashPasswordFromBcrypt = await hashPassword(matKhau);

    //   const user = await TaiKhoan.create({
    //     tenDangNhap,
    //     matKhau: hashPasswordFromBcrypt,
    //     email,
    //     loaiTaiKhoan,
    //     xacThucEmail: false,
    //     gioHang: gioHang?._id,
    //     baoXau: false
    //   });
    //   const tokens = await token.create({
    //     taiKhoanId: user._id,
    //     token: jwt.sign({ id: user._id }, "jwtSecretKey", { expiresIn: 300 }),
    //   });
    //   const url = `localhost:3000/${user._id}/verify/${tokens.token}`;
    //   await sendEmail(user.email, "Verify Email", url);
    //   res
    //     .status(201)
    //     .send({ message: "An email sent to your account please verify" });
    // }
    if (checkTrungTenDangNhap?._id) {
      res.status(400).json({
        error: {
          message: "Tên đăng nhập đã tồn tại",
        },
      });
    } else {
      // const hashPassword = ""

      const gioHang = await GioHang.create({
        danhSach: [],
      });
      const hashPasswordFromBcrypt = await hashPassword(matKhau);

      const user = await TaiKhoan.create({
        tenDangNhap,
        matKhau: hashPasswordFromBcrypt,
        email,
        loaiTaiKhoan,
        gioHang: gioHang?._id
      });
      const tokens = await token.create({
        taiKhoanId: user._id,
        token: jwt.sign({ id: user._id }, "jwtSecretKey", { expiresIn: 300 }),
      });
      // const url = `localhost:3000/${user._id}/verify/${tokens.token}`;
      // await sendEmail(user.email, "Verify Email", url);
      res
        .status(201)
        .send({ message: "Đăng ký tài khoản thành công" });
    }
  } catch (error) {}
};

const updateTaiKhoan = async (req, res) => {
  const { _id, tenDangNhap, matKhau, thongTinNhanHang, loaiTaiKhoan } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res
        .status(400)
        .json({ error: { message: "Tài khoản không tồn tại" } });
    }
    const account = await TaiKhoan.findOneAndUpdate(
      { _id: _id },
      { ...req.body }
    );

    if (!account) {
      return res
        .status(400)
        .json({ error: { message: "Tài khoản không tồn tại" } });
    }

    res.status(200).json({ data: account, message: "Cập nhật thành công" });
  } catch (err) {
    return res.status(500).json({ error: { message: "Lỗi hệ thống" } });
  }
};

const loginAdmin = async (req, res) => {
  const { tenDangNhap, matKhau } = req?.body;
  try {
    const users = await TaiKhoan.findOne({ tenDangNhap });
    if (users) {
      const checkPassword = await bcrypt.compareSync(matKhau, users?.matKhau);
      if (checkPassword) {
        if (
          users.loaiTaiKhoan === "admin" ||
          users.loaiTaiKhoan === "employee"
        ) {
          const id = users?._id;
          // Đăng ký token
          // const token = jwt.sign({ id }, "jwtSecretKey", { expiresIn: 300 });
          const token = jwt.sign(
            { users },
            "secret",
            { expiresIn: "24h" },
            "9359AF90D36CEC62F9522CE3394E8E2E335DF77983E8F9D9AC77C10D09D3074C"
          );
          // Thành công trả về status 200 và message
          return res.status(200).json({
            Success: true,
            token,
            Data: {
              tenDangNhap: users?.tenDangNhap,
              email: users?.email,
            },
            Message: "Đăng nhập thành công.",
          });
        } else {
          return res.status(400).json({
            error: { message: "Tài khoản không được cấp quyền" },
          });
        }
      } else {
        res
          .status(400)
          .json({ error: { message: "Mật khẩu không chính xác" } });
      }
    } else {
      res.status(400).json({ error: { message: "Tài khoản không tồn tại" } });
    }
  } catch (error) {
    res.status(400).json({ error: "Lỗi hệ thông" });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const account = await TaiKhoan.findOne({ email });

    if (account) {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*";
      //let result khởi tạo chuỗi rỗng để lưu trữ chuỗi ngẫu nhiên được tạo
      let result = "";

      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
      }
      //Math.random() trả về một số ngẫu nhiên từ 0-1
      //Math.floor() làm tròn xuống để có một số nguyên.
      //result += characters.charAt(randomIndex);:
      //Thêm ký tự tại vị trí randomIndex của chuỗi characters vào chuỗi result.
      //charAt() là một phương thức của chuỗi JavaScript được sử dụng để trả về ký tự tại một vị trí cụ thể trong chuỗi.
      const hashPasswordFromBcrypt = await hashPassword(result);
      await sendEmailForgetPassword(email, "New password", result);
      const updateAccount = await TaiKhoan.findOneAndUpdate(
        { _id: account._id },
        { matKhau: hashPasswordFromBcrypt }
      );
      if (updateAccount) {
        res.status(200).json({
          data: hashPasswordFromBcrypt,
          message: "Mật khẩu mới đã được chuyển tới email. Vui lòng kiểm tra",
        });
      }
    } else {
      return res.status(400).json({
        error: { message: "Email này chưa được đăng ký trước đó" },
      });
    }
  } catch (err) {
    res.status(400).json({
      error: { message: "Lỗi hệ thống!" },
    });
  }
};

const changePassword = async (req, res) => {
  const { id, matKhauHienTai, matKhauMoi } = req.body;
  try {
    const taiKhoan = await TaiKhoan.findOne({ _id: id });
    // const isPasswordValid = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/.test(
    //   matKhauMoi
    // );
    // if (!isPasswordValid) {
    //   return res.status(400).json({
    //     error: {
    //       message:
    //         "Mật khẩu không hợp lệ. Phải bắt đầu bằng chữ cái viết hoa và chứa ít nhất một ký tự đặc biệt.",
    //     },
    //   });
    // }
    // if (/\s/.test(matKhauMoi)) {
    //   return res.status(400).json({
    //     error: { message: "Mật khẩu không được chứa dấu cách" },
    //   });
    // }
    //Hàm compareSync của bcrypt trả về một giá trị boolean (true nếu mật khẩu khớp và false nếu không khớp)
    const checkPassword = await bcrypt.compareSync(
      matKhauHienTai,
      taiKhoan?.matKhau
    );
    if (checkPassword) {
      if (!bcrypt.compareSync(matKhauMoi, taiKhoan?.matKhau)) {
        const hashPasswordFromBcrypt = await hashPassword(matKhauMoi);
        const updateAccount = await TaiKhoan.findOneAndUpdate(
          { _id: id },
          { matKhau: hashPasswordFromBcrypt }
        );
        if (updateAccount) {
          res.status(200).json({ message: "Mật khẩu đã được cập nhật" });
        } else {
          return res.status(400).json({ message: "Cập nhật không thành công" });
        }
      } else {
        return res
          .status(400)
          .json({ error: { message: "Trùng với mật khẩu hiện tại" } });
      }
    } else {
      return res
        .status(400)
        .json({ error: { message: "Mật khẩu hiện tại không chính xác" } });
    }
  } catch (err) {
    return res.status(500).json({ error: { message: "Lỗi hệ thống" } });
  }
};

module.exports = {
  postCreateTaiKhoan,
  getAllTaiKhoan,
  loginTaiKhoan,
  loginAdmin,
  updateTaiKhoan,
  getAccountByID,
  forgetPassword,
  changePassword,
  getTaiKhoanByField
};
