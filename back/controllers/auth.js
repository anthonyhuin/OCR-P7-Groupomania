const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const db = require("../database/models");
const User = db.User;
const { key } = require("../keys");

exports.login = async (req, res) => {
  const body = req.body;
  const user = await User.findOne({ raw: true, where: { email: body.email } });

  if (user === null) {
    res.status(401).json("Mauvais email ou mot de passe");
  } else {
    if (bcrypt.compareSync(body.password, user.password)) {
      if (user.active == 0) {
        return res.status(400).json("Compte désactivé");
      }
      const token = jsonwebtoken.sign(
        {
          id: user.id,
          roles: user.roles,
        },
        { key },
        {
          expiresIn: "10 days",
          algorithm: "RS256",
        }
      );
      res.cookie("token", token);
      delete user.password;

      res.json(user);
    } else {
      res.status(401).json("Mauvais email ou mot de passe");
    }
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
  res.end();
};
