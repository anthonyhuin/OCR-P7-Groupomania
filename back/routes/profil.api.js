const router = require("express").Router();
const profilControllers = require("../controllers/profil");
const auth = require("../middleware/auth");

router.get("/:id", auth, profilControllers.getProfil);
router.get("/post/:id", auth, profilControllers.getPostProfil);
//router.get("/getlike/:id", likeControllers.getLike);

module.exports = router;
