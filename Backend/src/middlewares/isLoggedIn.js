const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET);

    // decoded should contain { id, email }
    req.user = decoded;

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = isLoggedIn;
