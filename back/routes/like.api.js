const router = require("express").Router();
const likeControllers = require("../controllers/like");
const auth = require("../middleware/auth");

router.post("/", auth, likeControllers.setLike);
//router.get("/getlike/:id", likeControllers.getLike);

module.exports = router;
