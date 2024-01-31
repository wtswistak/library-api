const { createToken } = require("../middlewares/validateToken");
const bcrypt = require("bcrypt");
const { addUser, getUser, getByUsername } = require("../services/authService");
const { CustomError, errorHandler } = require("../utils/error");
const passwordValidator = require("../utils/passwordValidator");

const register = async (req, res, isAdmin) => {
  const { username, password, name } = req.body;
  try {
    if (!username || !password || !name)
      throw new CustomError(400, "Missing values");

    const user = await getByUsername(username);
    if (user) throw new CustomError(400, "Username already exist");

    if (!passwordValidator(password)) {
      throw new CustomError(400, "Incorrect password");
    }

    const passwordCrypt = await bcrypt.hash(password, 10);
    await addUser(username, passwordCrypt, isAdmin, name);

    res.status(200).json({ status: "success", message: "Register success" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const adminRegister = async (req, res) => {
  await register(req, res, true);
};
const userRegister = async (req, res) => {
  await register(req, res, false);
};

const login = async (req, res, isAdmin) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      throw new CustomError(400, "Missing values");
    }

    const user = await getUser(username);
    if (isAdmin && !user.isAdmin) {
      throw new CustomError(400, "Access denied");
    }
    if (!isAdmin && user.isAdmin) {
      throw new CustomError(400, "Access denied");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new CustomError(400, "Invalid password");
    }

    const token = createToken(user.id, user.isAdmin);
    res.cookie("token", token, { httpOnly: true }).status(200);
    res.status(200).json({ status: "success", message: "Login success" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const userLogin = async (req, res) => {
  await login(req, res, false);
};
const adminLogin = async (req, res) => {
  await login(req, res, true);
};
module.exports = { adminRegister, userRegister, userLogin, adminLogin };
