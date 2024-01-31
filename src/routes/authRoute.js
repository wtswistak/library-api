const {
  adminRegister,
  userRegister,
  userLogin,
  adminLogin,
} = require("../controllers/authController");

const router = require("express").Router();

router.route("/admin/register").post(adminRegister);
router.route("/admin/login").post(adminLogin);

router.route("/user/register").post(userRegister);
router.route("/user/login").post(userLogin);

module.exports = router;
