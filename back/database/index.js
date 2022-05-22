require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DATA_BASE, process.env.USER, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.log("Unable to connect to the database:", err);
  });

const db = {};

db.sequelize = sequelize;

db.user = require("./models/user.model")(sequelize, DataTypes);
db.post = require("./models/post.model")(sequelize, DataTypes);
db.like = require("./models/like.model")(sequelize, DataTypes);
db.comment = require("./models/comment.model")(sequelize, DataTypes);

// db.sequelize.sync().then(() => {
//   console.log("Re-sync done!");
// });

module.exports = db;
