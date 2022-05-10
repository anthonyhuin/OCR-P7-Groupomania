const router = require("express").Router();
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const db = require("../database/index");
const User = db.users;
const { keyPub } = require("../keys");

router.post("/", async (req, res) => {
  let data = {
    id: Math.floor(Math.random() * 48565263),
    email: req.body.email,
    first_name: req.body.firstname,
    last_name: req.body.lastname,
    password: await bcrypt.hash(req.body.password, 8),
  };
  try {
    const user = await User.create(data);
    res.status(200).send(user);
  } catch (e) {
    res.status(400).json("Erreur lors de l'inscription");
  }
});

router.get("/current", async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decodedToken = jsonwebtoken.verify(token, keyPub);
      console.log(decodedToken);
      const user = await User.findOne({ attributes: { exclude: ["password"] }, where: { id: decodedToken.sub } });
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
});
module.exports = router;
