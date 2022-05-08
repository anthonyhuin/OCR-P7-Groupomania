const express = require("express");
const path = require("path");
require("dotenv").config();
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");
const port = "3000";
module.exports = db = {};

initialize();

async function initialize() {
  // create db if don't exist
  const connection = await mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DATA_BASE}\`;`);

  // connect to db

  const sequelize = new Sequelize(process.env.DATA_BASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: "mysql",
  });

  // init models and add them to the exported db object
  db.User = require("./user.model")(sequelize);

  // sync all models with database
  await sequelize.sync();
}

const app = express();

app.use(express.static("../client-build"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client-build/index.html"));
});

app.listen(port);
