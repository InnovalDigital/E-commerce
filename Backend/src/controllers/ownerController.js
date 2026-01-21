const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema"); // owner = admin user

/**
 * =========================
 * CREATE OWNER (ADMIN)
 * =========================
 * POST /owners/create
 */
const createOwner = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check existing
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Owner already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create owner (admin)
        const owner = await User.create({
            username,
            email,
            password: hashedPassword,
            isAdmin: true, // 🔥 THIS MAKES OWNER
            isVerified: true
        });

        return res.status(201).json({
            success: true,
            message: "Owner created successfully",
            owner: {
                id: owner._id,
                username: owner.username,
                email: owner.email,
            },
        });
    } catch (error) {
        console.error("CREATE OWNER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/**
 * =========================
 * OWNER LOGIN
 * =========================
 * POST /owners/login
 */
const ownerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const owner = await User.findOne({ email, isAdmin: true });
        if (!owner) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, owner.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: owner._id, isAdmin: true },
            process.env.SECRET,
            { expiresIn: "7d" }
        );

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Owner login successful",
            user: {
                id: owner._id,
                username: owner.username,
                email: owner.email,
                isAdmin: owner.isAdmin, // 🔥 REQUIRED
            },
        });

    } catch (error) {
        console.error("OWNER LOGIN ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/**
 * =========================
 * GET OWNER PROFILE
 * =========================
 * GET /owners/me
 */
const getOwnerProfile = async (req, res) => {
    try {
        const owner = await User.findById(req.user.id).select("-password");

        if (!owner || !owner.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }

        // GET /users/me
        res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                isAdmin: user.isAdmin,
            },
        });

    } catch (error) {
        console.error("GET OWNER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = {
    createOwner,
    ownerLogin,
    getOwnerProfile,
};
