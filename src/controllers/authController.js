const { queryDb, client } = require("../utils/queryDb");
const { createToken } = require("../middlewares/validateToken");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  const { username, password, isAdmin, firstName } = req.body;

  if (!username || !password || !isAdmin || !firstName)
    return res.status(400).send("Missing values");

  if (password.length < 6) return res.status(400).send("Password is too short");
  try {
    const isUsernameTaken = await queryDb(
      `SELECT * FROM users WHERE username=$1`,
      [username],
      client
    );

    if (isUsernameTaken.length > 0)
      return res.status(400).send("Username is taken");

    if (isAdmin !== "FALSE" && isAdmin !== "TRUE")
      return res.status(400).send("value isAdmin must be TRUE or FALSE");

    const passwordCrypt = await bcrypt.hash(password, 10);
    await queryDb(
      `INSERT INTO users(username, password,is_admin,first_name) VALUES($1, $2, $3, $4)`,
      [username, passwordCrypt, isAdmin, firstName],
      client
    );

    res.status(200).send("Register success");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const data = await queryDb(
      `SELECT * FROM users WHERE username=$1`,
      [username],
      client
    );

    const user = data[0];
    if (!user) {
      return res.status(400).send("Invalid username");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid password");
    }

    const token = createToken(user.id, user.is_admin);
    res.cookie("token", token, { httpOnly: true }).status(200);
    res.send("Login success");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = { login, register };
