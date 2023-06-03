const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decodedToken.username;
    next();
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      console.error("Invalid token:", err.message);
      return res.status(401).json({ error: "Invalid token" });
    }

    console.error("Error authenticating user:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
