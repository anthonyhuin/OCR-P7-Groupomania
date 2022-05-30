const jsonwebtoken = require("jsonwebtoken");
const { keyPub } = require("../keys");

module.exports = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(498).send({
      error: "Pas de token",
    });

  try {
    const decoded = jsonwebtoken.verify(token, keyPub);
    req.user = decoded;
  } catch (error) {
    return res.status(498).send({
      error: "Token invalide",
    });
  }

  next();
};
