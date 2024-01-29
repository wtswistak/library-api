const { login, register } = require("../controllers/authController");

const router = require("express").Router();

router.route("/login").post(login);
router.route("/register").post(register);

module.exports = router;
