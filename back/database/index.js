require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DATA_BASE, process.env.USER, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: "mysql",
  operatorsAliases: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connected..");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./models/user.model")(sequelize, DataTypes);

db.sequelize.sync({ force: false }).then(() => {
  console.log("yes re-sync done!");
});

module.exports = db;
