const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");

module.exports = async (email, subject, data) => {
  try {
    // Tạo transporter
    const transporter = nodemailer.createTransport({
      host: "stmp.gmail.com",
      service: "gmail",
      port: "587",
      secure: Boolean(true),
      auth: {
        user: "dangkhoathai163@gmail.com",
        pass: "isxn wuva oowi anpo",
      },
    });

    // Read the HTML template
    const source = fs.readFileSync(__dirname + "/emailTemplatePaymentSuccess.hbs", "utf8");
    const template = handlebars.compile(source);

    // Replace placeholders in the template
    const html = template({ danhSach: data?.danhSach, tongGia: (data?.tongGia).toLocaleString(), maDonHang: data?.maDonHang, thongTinGiaoHang: data?.thongTinGiaoHang, email: email });

    // Send the email
    await transporter.sendMail({
      from: "📚 BLACK&CAT STORE",
      to: email,
      subject: subject,
      text: "Đặt hàng thành công",
      html: html,
      attachments: [
        {
          filename: "logo.png",
          path: `${__dirname}/image/logo.png`,
          cid: "logo",
        },
      ],
    });
  } catch (err) {}
};
