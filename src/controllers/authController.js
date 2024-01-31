const { createToken } = require("../middlewares/validateToken");
const bcrypt = require("bcrypt");
const { addUser, getUser } = require("../services/authService");
const { CustomError, errorHandler } = require("../utils/error");

const register = async (req, res, isAdmin) => {
  try {
    const { username, password, name } = req.body;
    if (!username || !password || !name) {
      throw new CustomError(400, "Missing values");
    }
    // if (password.length < 6) {
    //   throw new ErrorHandler(400, "Password is too short");
    // }

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

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new CustomError(400, "Missing values");
    }
    const user = await getUser(username);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new CustomError(400, "Invalid password");
    }
    const token = createToken(user.id, user.isAdmin);
    res.cookie("token", token, { httpOnly: true }).status(200);
    res.send("Login success");
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = { adminRegister, userRegister, login };
