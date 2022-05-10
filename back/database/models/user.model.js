module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
    },
    profile_picture: {
      type: DataTypes.STRING,
    },
    followers: {
      type: DataTypes.TEXT,
    },
    following: {
      type: DataTypes.STRING,
    },
    birthdate: {
      type: DataTypes.STRING,
    },
    account_disable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
  return User;
};
