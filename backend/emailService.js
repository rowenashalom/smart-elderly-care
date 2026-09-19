const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendCaregiverAlert(
    caregiverEmail,
    caregiverName,
    patientName,
    medicineName,
    dosage,
    medicineTime
) {
    if (!caregiverEmail) {
        console.log("No caregiver email available.");
        return;
    }

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: caregiverEmail,
            subject: "🚨 Missed Medicine Alert",
            text:
                "Hello " + caregiverName + ",\n\n" +
                "This is an alert from Smart Elderly Care Assistant.\n\n" +
                "Patient: " + patientName + "\n" +
                "Medicine: " + medicineName + "\n" +
                "Dosage: " + dosage + "\n" +
                "Scheduled Time: " + medicineTime + "\n\n" +
                "⚠️ The patient appears to have missed this medicine.\n" +
                "Please check on the patient.\n\n" +
                "Smart Elderly Care Assistant"
        });

        console.log(
            "Caregiver alert email sent to:",
            caregiverEmail
        );

    } catch (error) {
        console.error(
            "Email sending error:",
            error.message
        );
    }
}

module.exports = {
    sendCaregiverAlert
};