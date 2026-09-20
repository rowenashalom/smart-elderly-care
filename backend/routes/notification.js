const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Medicine = require("../models/Medicine");

const {
    sendCaregiverAlert
} = require("../emailService");


// ================= CAREGIVER ALERT =================

router.post("/caregiver-alert", async (req, res) => {

    try {

        const {
            userId,
            medicineId
        } = req.body;


        // Find user
        const user =
            await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }


        // Find medicine
        const medicine =
            await Medicine.findById(medicineId);

        if (!medicine) {
            return res.status(404).json({
                message: "Medicine not found."
            });
        }


        // Check caregiver email
        if (!user.caregiverEmail) {
            return res.status(400).json({
                message:
                    "Caregiver email is not available."
            });
        }


        // Send email
        await sendCaregiverAlert(
            user.caregiverEmail,
            user.caregiverName || "Caregiver",
            user.name,
            medicine.medicineName,
            medicine.dosage,
            medicine.time
        );


        res.status(200).json({
            message:
                "Caregiver alert email sent successfully!"
        });


    } catch (error) {

        console.error(
            "Caregiver alert error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to send caregiver alert."
        });

    }

});


module.exports = router;