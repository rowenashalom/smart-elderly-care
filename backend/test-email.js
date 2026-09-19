require("dotenv").config();

const { sendCaregiverAlert } = require("./emailService");

async function testEmail() {
    await sendCaregiverAlert(
        process.env.EMAIL_USER,
        "Test Caregiver",
        "Test Patient",
        "Test Medicine",
        "1 tablet",
        "08:00"
    );
}

testEmail();