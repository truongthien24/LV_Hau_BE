const mongoose  = require("mongoose");

const fileSchema = mongoose.Schema({
    file: String,
})

const FileModel = mongoose.model("file", fileSchema);

module.exports = FileModel