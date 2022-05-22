const router = require("express").Router();
const authControllers = require("../controllers/auth");
const auth = require("../middleware/auth");

router.post("/", authControllers.login);
router.delete("/", authControllers.logout);

module.exports = router;
