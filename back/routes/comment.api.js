const router = require("express").Router();
const commentControllers = require("../controllers/comment");
const auth = require("../middleware/auth");

router.post("/:id", auth, commentControllers.createComment);
router.delete("/:id", auth, commentControllers.deleteComment);

module.exports = router;
