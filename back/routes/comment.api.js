const router = require("express").Router();
const commentControllers = require("../controllers/comment");
const auth = require("../middleware/auth");

//router.get("/:id", auth, commentControllers.getAllComments);
router.post("/:id", auth, commentControllers.createComment);
router.delete("/:id", auth, commentControllers.deleteComment);

//router.get("/getlike/:id", likeControllers.getLike);

module.exports = router;
