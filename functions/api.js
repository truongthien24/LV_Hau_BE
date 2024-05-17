const express = require("express");
// Kết nối mongodb
const mongoose = require("mongoose");
const cors = require("cors");
// Kết nối tới api
const apiRoute = require("../src/routes/api");
const bodyParser = require("body-parser");
const passport = require("passport");
const strategies = require("../src/config/passport");
const app = express();
const serverless = require('serverless-http');

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Enable authentication
app.use(passport.initialize());
passport.use('jwt', strategies.jwt);

// Route
// app.use("/api/", apiRoute);

app.use("/.netlify/functions/api/", apiRoute);

// Kết nối db
mongoose.connect(
  "mongodb+srv://blackcat:0122123123@atlascluster.kd36usa.mongodb.net/thuesach?retryWrites=true&w=majority"
);

const conn = mongoose.connection;
conn.once("open", () => {
  console.log("Successfull connection to db");
});
conn.on("error", () => {
  console.log("Fail to connection to db");
});

module.exports.handler = serverless(app);