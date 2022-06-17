const router = require("express").Router();
const likeControllers = require("../controllers/like");
const auth = require("../middleware/auth");

router.post("/", auth, likeControllers.setLike);

module.exports = router;
