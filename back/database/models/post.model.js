const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      models.Post.belongsTo(models.User, {
        foreignKey: "userId",
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
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      hasLiked: {
        type: DataTypes.VIRTUAL,
        get() {
          return false;
        },
      },
      commentCount: {
        type: DataTypes.VIRTUAL,
        get() {
          return 5;
        },
      },
      likeCount: {
        type: DataTypes.VIRTUAL,
        get() {
          return 5;
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
