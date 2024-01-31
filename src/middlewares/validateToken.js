const jwt = require("jsonwebtoken");

const createToken = (userId, isAdmin) => {
  return jwt.sign({ userId, isAdmin }, process.env.TOKEN, { expiresIn: "1h" });
};

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ status: "error", message: "Access denied" });

  jwt.verify(token, process.env.TOKEN, (err, decoded) => {
    if (err)
      return res
        .status(401)
        .json({ status: "error", message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res
        .status(401)
        .json({ status: "error", message: "Access denied" });
    }
  });
};

const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user.isAdmin) {
      next();
    } else {
      return res
        .status(401)
        .json({ status: "error", message: "Access denied" });
    }
  });
};

module.exports = { createToken, verifyToken, verifyAdmin, verifyUser };
