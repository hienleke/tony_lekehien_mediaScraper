const jwt = require("jsonwebtoken");
const log4js = require("../config/log4jsConfig");
const logger = log4js.getLogger();
const config = require("../config/config.json");

const users = [
  { id: 1, username: "admin", password: "password" },
  { id: 2, username: "user", password: "123456" },
];

const SECRET_KEY = config.jwt.key;

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = users.find((u) => u.username === username && u.password === password);

    if (!user) {
      logger.warn(`Failed login attempt for username: ${username}`);
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {

    logger.error("Error in login controller:", error);
    next(error);
  }
};

module.exports = {
  login,
};
