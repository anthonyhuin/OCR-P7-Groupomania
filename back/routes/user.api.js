const router = require("express").Router();
const userControllers = require("../controllers/user");
const auth = require("../middleware/auth");

router.post("/", userControllers.signIn);
router.get("/current", userControllers.checkTokenFront);
router.get("/getuser/:id", auth, userControllers.getUserId);
router.get("/disable/:id", auth, userControllers.disableAccount);

module.exports = router;
