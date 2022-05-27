const router = require("express").Router();
const profilControllers = require("../controllers/profil");
const auth = require("../middleware/auth");

router.get("/:id", auth, profilControllers.getInfoProfil);
router.get("/post/:id", auth, profilControllers.getPostProfil);
router.patch("/:id", auth, profilControllers.modifyProfil);
//router.get("/getlike/:id", likeControllers.getLike);

module.exports = router;
