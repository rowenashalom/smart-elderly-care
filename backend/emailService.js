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

        const message =
            "Hello " + caregiverName + ",\n\n" +

            "This is an alert from Smart Elderly Care Assistant.\n\n" +

            "⚠️ THE PATIENT HAS MISSED THEIR SCHEDULED MEDICINE.\n\n" +

            "Patient: " + patientName + "\n" +
            "Medicine: " + medicineName + "\n" +
            "Dosage: " + dosage + "\n" +
            "Scheduled Time: " + medicineTime + "\n\n" +

            "The patient did not respond to the medicine reminder " +
            "within the allowed time, so this medicine has been " +
            "marked as MISSED.\n\n" +

            "Please check on the patient and ensure the medicine " +
            "is taken according to the doctor's instructions.\n\n" +

            "Smart Elderly Care Assistant";


        const response = await fetch(
            "https://api.resend.com/emails",
            {
                method: "POST",

                headers: {
                    "Authorization":
                        "Bearer " +
                        process.env.RESEND_API_KEY,

                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    from:
                        "Smart Elderly Care <onboarding@resend.dev>",

                    to: [
                        caregiverEmail
                    ],

                    subject:
                        "🚨 Missed Medicine Alert - Action Required",

                    text:
                        message
                })
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Resend email failed."
            );

        }


        console.log(
            "Caregiver alert email sent successfully:",
            data.id
        );


        return data;


    } catch (error) {

        console.error(
            "Email sending error:",
            error.message
        );

        throw error;
    }
}


module.exports = {
    sendCaregiverAlert
};