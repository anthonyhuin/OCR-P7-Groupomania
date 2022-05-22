const router = require("express").Router();
const postControllers = require("../controllers/post");
const auth = require("../middleware/auth");

router.post("/", auth, postControllers.createPost);
router.get("/", auth, postControllers.getAllPosts);
router.delete("/:id", auth, postControllers.deletePost);

module.exports = router;
