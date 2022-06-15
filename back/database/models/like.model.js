const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      models.Like.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      models.Like.belongsTo(models.Post, {
        foreignKey: "postId",
        onDelete: "CASCADE",
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
