// server/routes/authRoutes.js

const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const {
    login,
    register,
    updateProfile
} = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);

router.put( "/profile", updateProfile);

router.post("/google", async (req, res) => {
    try {
        const { token } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        const { email, name, picture } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                fullname: name,
                email,
                password: "google-auth", // dummy
                avatar: picture,
                authProvider: "google"
            });
        }

        const jwtToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            user,
            token: jwtToken
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Google auth failed"
        });
    }
});

module.exports = router;