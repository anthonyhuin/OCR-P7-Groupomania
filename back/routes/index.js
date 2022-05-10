const router = require("express").Router();
const userApi = require("./user.api");
const authApi = require("./auth.api");
const cors = require("cors");

router.use("/api/user", cors(), userApi);
router.use("/api/auth", cors(), authApi);

module.exports = router;
