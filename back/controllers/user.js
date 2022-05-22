const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const db = require("../database/index");
const User = db.user;
const { keyPub } = require("../keys");

exports.signIn = async (req, res) => {
  let data = {
    email: req.body.email,
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    profilePicture: `https://avatars.dicebear.com/api/adventurer-neutral/${req.body.firstname}.svg`,
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
