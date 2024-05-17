const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    taiKhoanId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "taiKhoan",
        unique: true,
    },
    token: {type: String, required: true},
    createAt: {type: Date, default: Date.now(), expires: 3600} // 1 Hour
})

module.exports = mongoose.model("token", tokenSchema);  
