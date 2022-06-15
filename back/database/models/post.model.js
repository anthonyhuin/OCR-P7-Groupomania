const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      models.Post.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      models.Post.hasMany(models.Like, { foreignKey: "postId" });
      models.Post.hasMany(models.Comment, { foreignKey: "postId" });
    }
  }
  Post.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      post: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      picture: {
        type: DataTypes.STRING,
      },

      editPost: {
        type: DataTypes.VIRTUAL,
        get() {
          return false;
        },
      },
      editMode: {
        type: DataTypes.VIRTUAL,
        get() {
          return false;
        },
      },
    },
    {
      freezeTableName: true,
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
