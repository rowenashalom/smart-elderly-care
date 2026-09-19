const express = require("express");
const router = express.Router();

const User = require("../models/user");

// ================= REGISTER =================

router.post("/register", async (req, res) => {
    try {

        console.log("REGISTER DATA:", req.body);
        
        const {
            name,
            dob,
            email,
            phone,
            password,
            bloodGroup,
            conditions,
            allergies,
            caregiverName,
            caregiverEmail,
            relationship,
            caregiverPhone
        } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "An account with this email already exists."
            });
        }

        // Create user
       // Create user
const user = new User({
    name,
    dob,
    email,
    phone,
    password,
    bloodGroup,
    conditions,
    allergies,
    caregiverName,
    caregiverEmail,
    relationship,
    caregiverPhone
});

        await user.save();

        res.status(201).json({
            message: "Registration successful!",
            userId: user._id
        });

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            message: "Registration failed.",
            error: error.message
        });
    }
});


// ================= LOGIN =================

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Email not registered."
            });
        }

        // Check password
        if (user.password !== password) {
            return res.status(401).json({
                message: "Incorrect password."
            });
        }

        res.status(200).json({
            message: "Login successful!",
            user: user
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Login failed.",
            error: error.message
        });
    }
});


module.exports = router;