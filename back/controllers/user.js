const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const db = require("../database/models");
const Post = db.Post;
const User = db.User;
const Like = db.Like;
const Comment = db.Comment;
const { Op, Sequelize } = require("sequelize");
const { keyPub } = require("../keys");

exports.signIn = async (req, res) => {
  let data = {
    email: req.body.email,
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    profilePicture: `http://localhost:8000/default/pp.png`,
    bannerPicture: `http://localhost:8000/default/banner.png`,
    password: await bcrypt.hash(req.body.password, 8),
  };

  try {
    const userexist = await User.findOne({ where: { email: req.body.email } });
    if (userexist === null) {
      const user = await User.create(data);
      res.status(200).send(user);
    } else {
      res.status(400).json("Utilisateur deja existant");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.checkTokenFront = async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decodedToken = jsonwebtoken.verify(token, keyPub);

      const user = await User.findOne({ attributes: { exclude: ["password"] }, where: { id: decodedToken.id } });
      if (user === null) {
        res.json(null);
      } else {
        res.json(user);
      }
    } catch (e) {
      res.json(null);
    }
  } else {
    res.json(null);
  }
};

exports.getUserId = async (req, res) => {
  try {
    const user = await User.findOne({ attributes: { exclude: ["password"] }, where: { id: req.params.id } });
    if (user === null) {
      res.status(400).json("Utilisateur introuvable");
    } else {
      res.json(user);
    }
  } catch (e) {
    res.json(e);
  }
};

exports.disableAccount = async (req, res) => {
  try {
    if (req.user.id != req.params.id) {
      if (req.user.roles != "admin") {
        return res.status(401).send({ erreur: "Action non autorisée" });
      }
    }

    await User.upsert({ id: req.user.id, active: 0 });
    await Like.destroy({ where: { userId: req.user.id } });
    await Comment.destroy({ where: { userId: req.user.id } });
    await Post.destroy({ where: { userId: req.user.id } });

    res.status(200).json("ok");
  } catch (e) {
    res.status(400).json({ erreur: e });
  }
};

exports.suggestUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "firstName", "lastName", "profilePicture"],
      order: Sequelize.literal("rand()"),
      limit: 3,
      where: {
        id: {
          [Op.ne]: req.user.id,
        },
        active: 1,
      },
    });
    res.status(200).json(users);
  } catch (e) {
    res.status(400).json({ erreur: e });
  }
};

exports.findBirthday = async (req, res) => {
  try {
    const users = await User.findAll({ raw: true, attributes: ["id", "firstName", "lastName", "profilePicture", "birthdate"] });

    let date = new Date();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let dataBirthdate = null;

    await Promise.all(
      users.map(async (user) => {
        if (user.birthdate !== null) {
          let birthdate = user.birthdate.split("-");

          if (birthdate[1] - month == 0 && birthdate[2] - day == 0) {
            return (dataBirthdate = user);
          }
        }
      })
    );

    res.status(200).json(dataBirthdate);
  } catch (e) {
    console.log(e);
    res.status(400).json({ erreur: e });
  }
};
