const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("Im into auth middleware");

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    req.auth = {
      userId: decodedToken.userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
