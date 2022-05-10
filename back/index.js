const express = require("express");
require("dotenv").config();
const path = require("path");
const cookieParser = require("cookie-parser");
const port = "8000";
const router = require("./routes");
const cors = require("cors");
require("./database");

const app = express();
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.static("../client-build"));
app.use(express.json());
app.use(cookieParser());

app.use(router);

app.listen(port);

app.use(cors());
