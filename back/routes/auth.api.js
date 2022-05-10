const router = require("express").Router();
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const db = require("../database/index");
const User = db.users;
const { key } = require("../keys");

router.post("/", async (req, res) => {
  const body = req.body;
  const user = await User.findOne({ where: { email: body.email } });
  console.log(user);
  if (user === null) {
    res.status(400).json("Mauvais email ou mot de passerrrrrrrrr");
  } else {
    if (bcrypt.compareSync(body.password, user.password)) {
      const token = jsonwebtoken.sign(
        {},
        { key },
        {
          subject: user.id.toString(),
          expiresIn: 60 * 60,
          algorithm: "RS256",
        }
      );
      res.cookie("token", token);
      res.json(user);
    } else {
      res.status(400).json("Mauvais email ou mot de passeeeeeeeee");
    }
  }
});

router.delete("/", async (req, res) => {
  res.clearCookie("token");
  res.end();
});

module.exports = router;
