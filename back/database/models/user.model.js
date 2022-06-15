"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      models.User.hasMany(models.Post, { foreignKey: "userId" });
      models.User.hasMany(models.Like, { foreignKey: "userId" });
      models.User.hasMany(models.Comment, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bio: {
        type: DataTypes.TEXT,
      },
      job: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.STRING,
      },
      profilePicture: {
        type: DataTypes.STRING,
      },
      bannerPicture: {
        type: DataTypes.STRING,
      },
      birthdate: {
        type: DataTypes.STRING,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      roles: {
        type: DataTypes.STRING,
        defaultValue: "membre", //membre,modo,admin
      },
    },
    {
      freezeTableName: true,
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
