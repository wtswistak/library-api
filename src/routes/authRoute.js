const {
  adminRegister,
  login,
  userRegister,
} = require("../controllers/authController");

const router = require("express").Router();

router.route("/admin/register").post(adminRegister);
router.route("/admin/login").post(login);

router.route("/user/register").post(userRegister);
router.route("/user/login").post(login);

module.exports = router;
