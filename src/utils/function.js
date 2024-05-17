const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const hashPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashPassword = await bcrypt.hashSync(password, salt);
      //salt mã hóa mật khẩu thành 10 ký tự
      resolve(hashPassword);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { hashPassword };
