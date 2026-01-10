const User = require("../models/userSchema");

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).send("Invalid or expired verification link");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return res.redirect("https://e-commerce-ruddy-eta.vercel.app/email-verified");

  } catch (error) {
    console.error("VERIFY ERROR:", error);
    return res.status(500).send("Verification failed");
  }
};

module.exports = { verifyEmail };
