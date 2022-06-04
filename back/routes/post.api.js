const router = require("express").Router();
const postControllers = require("../controllers/post");
const auth = require("../middleware/auth");
const upload = require("../middleware/multer");

router.post("/", auth, upload, postControllers.createPost);
router.get("/", auth, postControllers.getAllPosts);
router.delete("/:id", auth, postControllers.deletePost);
router.patch("/:id", auth, postControllers.editPost);

module.exports = router;
