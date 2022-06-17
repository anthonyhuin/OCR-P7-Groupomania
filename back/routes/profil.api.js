const router = require("express").Router();
const profilControllers = require("../controllers/profil");
const auth = require("../middleware/auth");
const upload = require("../middleware/multer");

router.get("/:id", auth, profilControllers.getInfoProfil);
router.get("/post/:id", auth, profilControllers.getPostProfil);
router.post("/upload/banner", auth, upload, profilControllers.changeBanner);
router.post("/upload/pp", auth, upload, profilControllers.changeProfilPicture);
router.patch("/:id", auth, profilControllers.modifyProfil);

module.exports = router;
