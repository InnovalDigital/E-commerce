const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userSchema");
const crypto = require("crypto");
const resend = new Resend(process.env.RESEND_API_KEY);



/**
 * REGISTER USER
 * POST /register
 */
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 🔹 Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // 🔹 Check existing user
    const existedUser = await userModel.findOne({ email });
    if (existedUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered. Please login."
      });
    }

    // 🔹 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔐 Create verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // 🔹 Create user
    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
      profilepic: req.file
        ? {
          data: req.file.buffer,
          contentType: req.file.mimetype
        }
        : undefined,
      verificationToken,
      isVerified: false,
    });

    // 🔗 Verification link
    const verifyLink = `https://ecommerce-backend-fob8.onrender.com/users/verify-email/${verificationToken}`;


    // 📧 Send email
   await resend.emails.send({
      from: `Farid'sStore <onboarding@resend.dev>`,
      to: user.email,
      subject: "Verify your email",
      html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Verify your email</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f5f5f5; font-family: Arial, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5; padding:40px 0;">
      <tr>
        <td align="center">
          
          <!-- Card -->
          <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <tr>
              <td align="center" style="padding:30px 20px 10px;">
                <h1 style="margin:0; font-family: 'Georgia', serif; font-size:28px; color:#000000;">
                  Farid<span style="color:#C2B59B;">'s</span>Store
                </h1>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td>
                <div style="width:60px; height:3px; background:#C2B59B; margin:16px auto;"></div>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:20px 30px; color:#333333;">
                <h2 style="margin-top:0; font-size:20px; color:#000000;">
                  Verify your email address
                </h2>

                <p style="font-size:14px; line-height:1.6;">
                  Welcome to <strong>Farid’sStore</strong> 👋  
                  <br /><br />
                  Thank you for creating an account. To keep your account secure and activate all features, please verify your email address by clicking the button below.
                </p>

                <!-- Button -->
                <div style="text-align:center; margin:30px 0;">
                  <a href="${verifyLink}" target="_blank"
                    style="
                      background:#000000;
                      color:#ffffff;
                      text-decoration:none;
                      padding:14px 28px;
                      border-radius:6px;
                      font-size:14px;
                      display:inline-block;
                    ">
                    Verify Email
                  </a>
                </div>

                <p style="font-size:13px; color:#555555; line-height:1.5;">
                  This verification link is valid for one time only.  
                  If you did not create this account, you can safely ignore this email.
                </p>

                <p style="font-size:13px; color:#555555;">
                  — Team Farid’sStore
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background:#fafafa; padding:15px; font-size:12px; color:#888888;">
                © ${new Date().getFullYear()} Farid’sStore. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
</html>
`,
    }).then(() => {
    console.log("Verification email sent");
  })
  .catch((err) => {
    console.error("EMAIL FAILED:", err.message);
  });



    // 🔹 Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRET,
      { expiresIn: "7d" }
    );

    // 🔹 Set cookie (secure)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // 🔹 Response to frontend
    return res.status(201).json({
      success: true,
      message: "Verification link sent to your email",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during registration"
    });
  }
};



module.exports = { register };
