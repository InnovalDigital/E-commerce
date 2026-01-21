    const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.SECRET);

    const user = await User.findById(decoded.id);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Admin access only" });
    }

    req.user = user; // attach admin user
    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = isAdmin;
