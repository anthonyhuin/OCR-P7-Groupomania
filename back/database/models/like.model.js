"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      models.Like.belongsTo(models.User, {
        foreignKey: "userId",
      });
      models.Like.belongsTo(models.Post, {
        foreignKey: "postId",
      });
    }
  }
  Like.init(
    {
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      sequelize,
      modelName: "Like",
    }
  );
  return Like;
};
