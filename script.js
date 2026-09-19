// =====================================================
// SMART ELDERLY CARE ASSISTANT
// MAIN JAVASCRIPT
// =====================================================

const API_URL = "http://localhost:5000";


// =====================================================
// GET CURRENT USER
// =====================================================

function getCurrentUser() {

    const user = localStorage.getItem("user");

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch (error) {
        console.error("User data error:", error);
        return null;
    }
}


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Smart Elderly Care Assistant loaded.");

    const user = getCurrentUser();

    if (user) {

        const userName =
            document.getElementById("userName");

        const topUserName =
            document.getElementById("topUserName");

        if (userName) {
            userName.textContent = user.name || "User";
        }

        if (topUserName) {
            topUserName.textContent = user.name || "User";
        }

    }


    // Dashboard page
    if (document.getElementById("medicineList")) {

        loadDashboard();

    }


    // Medicine page
    const medicineForm =
        document.getElementById("medicineForm");

    if (medicineForm) {

        medicineForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                addMedicine();

            }
        );

    }

});


// =====================================================
// REGISTER
// =====================================================

async function registerUser() {

    const name =
        document.getElementById("name")?.value.trim();

    const dob =
        document.getElementById("dob")?.value;

    const email =
        document.getElementById("email")?.value.trim();

    const phone =
        document.getElementById("phone")?.value.trim();

    const password =
        document.getElementById("password")?.value;

    const bloodGroup =
        document.getElementById("bloodGroup")?.value.trim();

    const conditions =
        document.getElementById("conditions")?.value.trim();

    const allergies =
        document.getElementById("allergies")?.value.trim();

    const caregiverName =
        document.getElementById("caregiverName")?.value.trim();
    const caregiverEmail = 
        document.getElementById("caregiverEmail").value.trim();

    const relationship =
        document.getElementById("relationship")?.value.trim();

    const caregiverPhone =
        document.getElementById("caregiverPhone")?.value.trim();
    


    if (!name || !email || !password) {

        alert("Please fill in the required fields.");

        return;

    }


    try {

        const response = await fetch(
            `${API_URL}/api/auth/register`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
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

                })

            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Registration failed."
            );

            return;

        }


        alert(
            "Registration successful! Please login."
        );


        window.location.href = "login.html";


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );

    }

}


// =====================================================
// LOGIN
// =====================================================

async function loginUser() {

    const email =
        document.getElementById("email")?.value.trim();

    const password =
        document.getElementById("password")?.value;


    if (!email || !password) {

        alert(
            "Please enter email and password."
        );

        return;

    }


    try {

        const response = await fetch(
            `${API_URL}/api/auth/login`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    email,
                    password

                })

            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Login failed."
            );

            return;

        }


        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );


        alert("Login successful!");


        window.location.href =
            "dashboard.html";


    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );

    }

}


// =====================================================
// DASHBOARD
// =====================================================

async function loadDashboard() {

    const user = getCurrentUser();


    if (!user) {

        alert(
            "Please login first."
        );

        window.location.href =
            "login.html";

        return;

    }


    // User name

    const userName =
        document.getElementById("userName");

    const topUserName =
        document.getElementById("topUserName");


    if (userName) {

        userName.textContent =
            user.name || "User";

    }


    if (topUserName) {

        topUserName.textContent =
            user.name || "User";

    }


    // Medical information

    const bloodGroup =
        document.getElementById("bloodGroup");

    const conditions =
        document.getElementById("conditions");

    const allergies =
        document.getElementById("allergies");


    if (bloodGroup) {

        bloodGroup.textContent =
            user.bloodGroup || "Not provided";

    }


    if (conditions) {

        conditions.textContent =
            user.conditions || "None";

    }


    if (allergies) {

        allergies.textContent =
            user.allergies || "None";

    }


    // Caregiver

    const caregiverName =
        document.getElementById("caregiverName");

    const relationship =
        document.getElementById("relationship");

    const caregiverPhone =
        document.getElementById("caregiverPhone");

    const caregiverEmail =
        document.getElementById("caregiverEmail");


    if (caregiverName) {

        caregiverName.textContent =
            user.caregiverName || "Not provided";

    }


    if (relationship) {

        relationship.textContent =
            user.relationship ||
            "Relationship not provided";

    }


    if (caregiverPhone) {

        caregiverPhone.textContent =
            user.caregiverPhone ||
            "No phone number";

    }

    if (caregiverEmail) {

        caregiverEmail.textContent =
            user.caregiverEmail ||
            "No email address";

    }

    // Load medicines

    await loadMedicines();

}


// =====================================================
// LOAD MEDICINES
// =====================================================

async function loadMedicines() {

    const user = getCurrentUser();


    if (!user || !user._id) {

        console.log(
            "No logged-in user found."
        );

        return;

    }


    try {

        const response = await fetch(
            `${API_URL}/api/medicine/${user._id}`
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load medicines."
            );

        }


        const medicines =
            await response.json();


        // Display medicines
        displayMedicines(medicines);


        // Today's medicine schedule
        showTodaySchedule(medicines);

        displayMissedMedicineAlerts(medicines);

        // Dashboard statistics
        updateDashboardStatistics(
            medicines
        );


        // Next reminder
        updateNextReminder(
            medicines
        );


        // Automatic reminder
        startMedicineReminder(
            medicines
        );


    } catch (error) {

        console.error(
            "Load medicine error:",
            error
        );


        const medicineList =
            document.getElementById(
                "medicineList"
            );


        if (medicineList) {

            medicineList.innerHTML = `
                <p class="loading-text">
                    Unable to load medicines.
                </p>
            `;

        }

    }

}


// =====================================================
// DISPLAY MEDICINES
// =====================================================

function displayMedicines(medicines) {

    const medicineList =
        document.getElementById(
            "medicineList"
        );


    if (!medicineList) {
        return;
    }


    medicineList.innerHTML = "";


    if (
        !medicines ||
        medicines.length === 0
    ) {

        medicineList.innerHTML = `
            <p class="loading-text">
                No medicines added yet.
            </p>
        `;

        return;

    }


    medicines.forEach(function (medicine) {

        const medicineCard =
            document.createElement("div");


        medicineCard.className =
            "medicine-card";


        medicineCard.innerHTML = `

            <div class="medicine-info">

                <h3>
                    💊 ${medicine.medicineName}
                </h3>

                <p>
                    <strong>Dosage:</strong>
                    ${medicine.dosage}
                </p>

                <p>
                    <strong>Period:</strong>
                    ${medicine.period}
                </p>

                <p>
                    <strong>Time:</strong>
                    ⏰ ${medicine.time}
                </p>

            </div>


            <div class="medicine-actions">

                <button
                    onclick="editMedicine('${medicine._id}')">

                    ✏️ Edit

                </button>


                <button
                    onclick="deleteMedicine('${medicine._id}')">

                    🗑️ Delete

                </button>

            </div>

        `;


        medicineList.appendChild(
            medicineCard
        );

    });

}


// =====================================================
// ADD MEDICINE
// =====================================================

async function addMedicine() {

    const user = getCurrentUser();


    if (!user || !user._id) {

        alert(
            "Please login first."
        );

        return;

    }


    const medicineName =
        document.getElementById(
            "medicineName"
        )?.value.trim();


    const dosage =
        document.getElementById(
            "dosage"
        )?.value.trim();


    const period =
        document.getElementById(
            "period"
        )?.value.trim();


    const time =
        document.getElementById(
            "time"
        )?.value;


    if (
        !medicineName ||
        !dosage ||
        !period ||
        !time
    ) {

        alert(
            "Please fill all medicine details."
        );

        return;

    }


    try {

        const response = await fetch(
            `${API_URL}/api/medicine/add`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    userId: user._id,

                    medicineName,
                    dosage,
                    period,
                    time

                })

            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to add medicine."
            );

            return;

        }


        alert(
            "Medicine added successfully!"
        );


        const form =
            document.getElementById(
                "medicineForm"
            );


        if (form) {
            form.reset();
        }


        // If dashboard exists,
        // refresh it

        if (
            document.getElementById(
                "medicineList"
            )
        ) {

            await loadMedicines();

        }

    } catch (error) {

        console.error(
            "Add medicine error:",
            error
        );

        alert(
            "Unable to connect to server."
        );

    }

}


// =====================================================
// EDIT MEDICINE
// =====================================================

async function editMedicine(id) {

    const newName =
        prompt(
            "Enter medicine name:"
        );


    if (newName === null) {
        return;
    }


    const newDosage =
        prompt(
            "Enter dosage:"
        );


    if (newDosage === null) {
        return;
    }


    const newPeriod =
        prompt(
            "Enter period:"
        );


    if (newPeriod === null) {
        return;
    }


    const newTime =
        prompt(
            "Enter time (HH:MM):"
        );


    if (newTime === null) {
        return;
    }


    try {

        const response = await fetch(

            `${API_URL}/api/medicine/${id}`,

            {

                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    medicineName:
                        newName,

                    dosage:
                        newDosage,

                    period:
                        newPeriod,

                    time:
                        newTime

                })

            }

        );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to update medicine."
            );

            return;

        }


        alert(
            "Medicine updated successfully!"
        );


        await loadMedicines();


    } catch (error) {

        console.error(
            "Edit medicine error:",
            error
        );

        alert(
            "Unable to update medicine."
        );

    }

}


// =====================================================
// DELETE MEDICINE
// =====================================================

async function deleteMedicine(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this medicine?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(

            `${API_URL}/api/medicine/${id}`,

            {

                method: "DELETE"

            }

        );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to delete medicine."
            );

            return;

        }


        alert(
            "Medicine deleted successfully!"
        );


        await loadMedicines();


    } catch (error) {

        console.error(
            "Delete medicine error:",
            error
        );

        alert(
            "Unable to delete medicine."
        );

    }

}


// =====================================================
// DASHBOARD STATISTICS
// =====================================================

function updateDashboardStatistics(
    medicines
) {

    const total =
        medicines.length;


    const totalMedicines =
        document.getElementById(
            "totalMedicines"
        );


    const completedMedicines =
        document.getElementById(
            "completedMedicines"
        );


    const pendingMedicines =
        document.getElementById(
            "pendingMedicines"
        );


    if (totalMedicines) {

        totalMedicines.textContent =
            total;

    }


    // Get today's completed medicines

    const completed =
        getCompletedMedicines();


    let completedCount = 0;


    medicines.forEach(function (medicine) {

        if (
            completed.includes(
                medicine._id
            )
        ) {

            completedCount++;

        }

    });


    if (completedMedicines) {

        completedMedicines.textContent =
            completedCount;

    }


    if (pendingMedicines) {

        pendingMedicines.textContent =
            total - completedCount;

    }

}


// =====================================================
// COMPLETED MEDICINES STORAGE
// =====================================================

function getCompletedMedicines() {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const key =
        "completedMedicines_" + today;


    const data =
        localStorage.getItem(key);


    if (!data) {
        return [];
    }


    try {

        return JSON.parse(data);

    } catch (error) {

        return [];

    }

}
// =====================================================
// MEDICINE STATUS STORAGE
// =====================================================

function getMedicineStatuses() {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    const key = "medicineStatuses_" + today;

    const data =
        localStorage.getItem(key);

    if (!data) {
        return {};
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}


function setMedicineStatus(medicineId, status) {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    const key = "medicineStatuses_" + today;

    const statuses =
        getMedicineStatuses();

    statuses[medicineId] = status;

    localStorage.setItem(
        key,
        JSON.stringify(statuses)
    );
}


function getMedicineStatus(medicineId) {

    const statuses =
        getMedicineStatuses();

    return statuses[medicineId] || "Pending";
}


// =====================================================
// SAVE COMPLETED MEDICINE
// =====================================================

function saveCompletedMedicine(
    medicineId
) {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const key =
        "completedMedicines_" + today;


    let completed =
        getCompletedMedicines();


    if (
        !completed.includes(
            medicineId
        )
    ) {

        completed.push(
            medicineId
        );

    }


    localStorage.setItem(
        key,
        JSON.stringify(completed)
    );

}


// =====================================================
// UPDATE NEXT REMINDER
// =====================================================

function updateNextReminder(
    medicines
) {

    const nextReminder =
        document.getElementById(
            "nextReminder"
        );


    if (!nextReminder) {
        return;
    }


    if (
        !medicines ||
        medicines.length === 0
    ) {

        nextReminder.textContent =
            "No reminders";

        return;

    }


    const now =
        new Date();


    const currentMinutes =
        now.getHours() * 60 +
        now.getMinutes();


    let closestMedicine = null;

    let closestDifference =
        Infinity;


    medicines.forEach(
        function (medicine) {

            if (!medicine.time) {
                return;
            }


            const parts =
                medicine.time.split(":");


            const hours =
                parseInt(parts[0]);


            const minutes =
                parseInt(parts[1]);


            const medicineMinutes =
                hours * 60 +
                minutes;


            let difference =
                medicineMinutes -
                currentMinutes;


            if (difference < 0) {

                difference +=
                    24 * 60;

            }


            if (
                difference <
                closestDifference
            ) {

                closestDifference =
                    difference;

                closestMedicine =
                    medicine;

            }

        }
    );


    if (closestMedicine) {

        nextReminder.textContent =
            closestMedicine.time;

    } else {

        nextReminder.textContent =
            "--";

    }

}


// =====================================================
// AUTOMATIC MEDICINE REMINDER
// =====================================================

let reminderInterval = null;

let reminderMedicines = [];

let lastReminderKey = "";


// Start reminder checking

function startMedicineReminder(
    medicines
) {

    reminderMedicines =
        medicines || [];


    // Stop old interval

    if (reminderInterval) {

        clearInterval(
            reminderInterval
        );

    }


    // Check immediately

    checkMedicineReminder();
    checkMissedMedicines();

    // Check every minute

    reminderInterval =
    setInterval(
        function () {

            checkMedicineReminder();
            checkMissedMedicines();

        },
        60000
    );


}
// =====================================================
// CHECK MISSED MEDICINES
// =====================================================
// ================= CHECK MISSED MEDICINES =================

// ================= CHECK MISSED MEDICINES =================

function checkMissedMedicines() {

    if (
        !reminderMedicines ||
        reminderMedicines.length === 0
    ) {
        return;
    }

    const now = new Date();

    const currentMinutes =
        now.getHours() * 60 +
        now.getMinutes();

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    const timerKey =
        "medicineReminderTimers_" + today;

    const shownKey =
        "medicineRemindersShown_" + today;


    // Get reminder history
    let shownReminders = {};

    const savedShown =
        localStorage.getItem(shownKey);

    if (savedShown) {
        try {
            shownReminders =
                JSON.parse(savedShown);
        } catch (error) {
            shownReminders = {};
        }
    }


    // Get snooze timers
    let timers = {};

    const savedTimers =
        localStorage.getItem(timerKey);

    if (savedTimers) {
        try {
            timers =
                JSON.parse(savedTimers);
        } catch (error) {
            timers = {};
        }
    }


    reminderMedicines.forEach(
        async function (medicine) {

            if (!medicine.time) {
                return;
            }

            const medicineId =
                medicine._id;


            // ================= TAKEN =================

            const completed =
                getCompletedMedicines();

            if (
                completed.includes(medicineId) ||
                getMedicineStatus(medicineId) === "Taken"
            ) {
                return;
            }


            // ================= SNOOZE =================

            const timer =
                timers[medicineId];

            if (
                timer &&
                timer.snoozeUntil
            ) {

                // Still waiting for snooze period
                if (
                    Date.now() <
                    timer.snoozeUntil
                ) {
                    return;
                }

                // Snooze finished.
                // Start a fresh 10-minute response period.

                timer.snoozeUntil = null;

                timer.responseDeadline =
                    Date.now() +
                    (10 * 60 * 1000);

                timers[medicineId] =
                    timer;

                localStorage.setItem(
                    timerKey,
                    JSON.stringify(timers)
                );

                setMedicineStatus(
                    medicineId,
                    "Pending"
                );

                showMedicineNotification(
                    medicine
                );

                return;
            }


            // ================= AFTER SNOOZE =================

            if (
                timer &&
                timer.responseDeadline
            ) {

                if (
                    Date.now() <
                    timer.responseDeadline
                ) {
                    return;
                }

                // Second 10-minute period finished

                delete timers[medicineId];

                localStorage.setItem(
                    timerKey,
                    JSON.stringify(timers)
                );

                setMedicineStatus(
                    medicineId,
                    "Missed"
                );

                console.log(
                    "Medicine marked as MISSED:",
                    medicine.medicineName
                );

                await notifyCaregiver(
                    medicine
                );

                displayMissedMedicineAlerts(
                    reminderMedicines
                );

                return;
            }


            // ================= NORMAL REMINDER =================

            const parts =
                medicine.time.split(":");

            const medicineMinutes =
                parseInt(parts[0]) * 60 +
                parseInt(parts[1]);


            // IMPORTANT:
            // Do nothing before scheduled time.

            if (
                currentMinutes <
                medicineMinutes
            ) {
                return;
            }


            // The reminder must have actually
            // appeared before we can mark it missed.

            if (
                !shownReminders[medicineId]
            ) {
                return;
            }


            // Wait 10 minutes after reminder

            if (
                currentMinutes <=
                medicineMinutes + 10
            ) {
                return;
            }


            // ================= MISSED =================

            if (
                getMedicineStatus(medicineId) ===
                "Missed"
            ) {
                return;
            }

            setMedicineStatus(
                medicineId,
                "Missed"
            );

            console.log(
                "Medicine marked as MISSED:",
                medicine.medicineName
            );

            await notifyCaregiver(
                medicine
            );

            displayMissedMedicineAlerts(
                reminderMedicines
            );
        }
    );
}

async function notifyCaregiver(medicine) {

    try {

        const user =
            JSON.parse(
                localStorage.getItem("user")
            );

        if (!user || !user._id) {
            console.log(
                "User information not available."
            );
            return;
        }

        if (!user.caregiverEmail) {
            console.log(
                "Caregiver email not available."
            );
            return;
        }

        const response =
            await fetch(
                "http://localhost:5000/api/notification/caregiver-alert",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        userId: user._id,
                        medicineId: medicine._id
                    })
                }
            );

        const data =
            await response.json();

        if (response.ok) {

            console.log(
                "📧 Caregiver email sent successfully!"
            );

        } else {

            console.error(
                "Caregiver email failed:",
                data.message
            );
        }

    } catch (error) {

        console.error(
            "Caregiver notification error:",
            error
        );
    }
}

// =====================================================
// CHECK MEDICINE REMINDER
// =====================================================

function checkMedicineReminder() {

    if (
        !reminderMedicines ||
        reminderMedicines.length === 0
    ) {

        return;

    }


    const now =
        new Date();


    const hours =
        String(
            now.getHours()
        ).padStart(2, "0");


    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");


    const currentTime =
        `${hours}:${minutes}`;


    const today =
        now.toISOString()
            .split("T")[0];


    reminderMedicines.forEach(
        function (medicine) {

            if (
                medicine.time !==
                currentTime
            ) {

                return;

            }


            const reminderKey =
                today +
                "_" +
                medicine._id +
                "_" +
                currentTime;


            // Prevent the same reminder
            // from appearing repeatedly

            if (
                lastReminderKey ===
                reminderKey
            ) {

                return;

            }


            lastReminderKey =
                reminderKey;


            const completed =
                getCompletedMedicines();


            // Don't remind if already taken

            if (
                completed.includes(
                    medicine._id
                )
            ) {

                return;

            }


            showMedicineNotification(
                medicine
            );

        }
    );

}


// =====================================================
// SHOW MEDICINE NOTIFICATION
// =====================================================

function showMedicineNotification(
    medicine
) {

    const medicineName =
        document.getElementById(
            "notificationMedicine"
        );


    const dosage =
        document.getElementById(
            "notificationDosage"
        );


    const period =
        document.getElementById(
            "notificationPeriod"
        );


    const notification =
        document.getElementById(
            "medicineNotification"
        );


    if (medicineName) {

        medicineName.textContent =
            medicine.medicineName;

    }


    if (dosage) {

        dosage.textContent =
            "Dosage: " +
            medicine.dosage;

    }


    if (period) {

        period.textContent =
            "Period: " +
            medicine.period;

    }


    if (notification) {

        notification.style.display =
            "block";

    }


    localStorage.setItem(
        "currentReminder",
        JSON.stringify(medicine)
    );
     
    // Record that this medicine reminder was actually shown

const today =
    new Date()
        .toISOString()
        .split("T")[0];

const shownKey =
    "medicineRemindersShown_" + today;

let shownReminders = {};

const savedShown =
    localStorage.getItem(shownKey);

if (savedShown) {
    try {
        shownReminders =
            JSON.parse(savedShown);
    } catch (error) {
        shownReminders = {};
    }
}

shownReminders[medicine._id] = true;

localStorage.setItem(
    shownKey,
    JSON.stringify(shownReminders)
);

    // Voice reminder

    speakMedicineReminder(
        medicine
    );


    // Optional browser notification

    showBrowserNotification(
        medicine
    );

}


// =====================================================
// CLOSE MEDICINE NOTIFICATION
// =====================================================

function closeMedicineNotification() {

    const notification =
        document.getElementById(
            "medicineNotification"
        );


    if (notification) {

        notification.style.display =
            "none";

    }

}


// =====================================================
// MARK MEDICINE AS TAKEN
// =====================================================

function markMedicineTaken() {

    const medicineData =
        localStorage.getItem(
            "currentReminder"
        );


    if (!medicineData) {

        closeMedicineNotification();

        return;

    }


    try {

        const medicine =
            JSON.parse(
                medicineData
            );


        saveCompletedMedicine(
            medicine._id
        );
        
        setMedicineStatus(medicine._id, "Taken");

        closeMedicineNotification();


        // Update statistics

        updateDashboardStatistics(
            reminderMedicines
        );


        alert(
            "✅ " +
            medicine.medicineName +
            " marked as taken."
        );


    } catch (error) {

        console.error(
            "Taken error:",
            error
        );

    }

}


// =====================================================
// SNOOZE MEDICINE
// =====================================================

// ================= SNOOZE MEDICINE =================

function snoozeMedicine() {

    const medicineData =
        localStorage.getItem(
            "currentReminder"
        );

    if (!medicineData) {
        closeMedicineNotification();
        return;
    }

    try {

        const medicine =
            JSON.parse(medicineData);

        const today =
            new Date()
                .toISOString()
                .split("T")[0];

        const timerKey =
            "medicineReminderTimers_" + today;

        let timers = {};

        const savedTimers =
            localStorage.getItem(timerKey);

        if (savedTimers) {
            try {
                timers =
                    JSON.parse(savedTimers);
            } catch (error) {
                timers = {};
            }
        }

        // Give the medicine another
        // 10 minutes before showing
        // the reminder again.

        timers[medicine._id] = {

            snoozeUntil:
                Date.now() +
                (10 * 60 * 1000),

            responseDeadline: null
        };

        localStorage.setItem(
            timerKey,
            JSON.stringify(timers)
        );

        // Mark as snoozed

        setMedicineStatus(
            medicine._id,
            "Snoozed"
        );

        closeMedicineNotification();

        alert(
            "⏰ Reminder snoozed for 10 minutes."
        );

        // Show reminder again after 10 minutes

        setTimeout(
            function () {

                const currentTimers =
                    localStorage.getItem(
                        timerKey
                    );

                let updatedTimers = {};

                if (currentTimers) {

                    try {
                        updatedTimers =
                            JSON.parse(
                                currentTimers
                            );
                    } catch (error) {
                        updatedTimers = {};
                    }
                }

                const timer =
                    updatedTimers[
                        medicine._id
                    ];

                if (!timer) {
                    return;
                }

                // Start a fresh 10-minute
                // response period

                timer.snoozeUntil = null;

                timer.responseDeadline =
                    Date.now() +
                    (10 * 60 * 1000);

                updatedTimers[
                    medicine._id
                ] = timer;

                localStorage.setItem(
                    timerKey,
                    JSON.stringify(
                        updatedTimers
                    )
                );

                setMedicineStatus(
                    medicine._id,
                    "Pending"
                );

                showMedicineNotification(
                    medicine
                );

            },

            10 * 60 * 1000
        );

    } catch (error) {

        console.error(
            "Snooze error:",
            error
        );
    }
}

// =====================================================
// SPEAK NORMAL REMINDER
// =====================================================

function speakReminder() {

    const user =
        getCurrentUser();


    const name =
        user
            ? user.name
            : "there";


    const message =

        "Hello " +
        name +
        ". This is your medicine reminder. " +
        "Please take your medicine according to your doctor's instructions.";


    speakText(
        message
    );

}


// =====================================================
// SPEAK MEDICINE REMINDER
// =====================================================

function speakMedicineReminder(
    medicine
) {

    const user =
        getCurrentUser();


    const name =
        user
            ? user.name
            : "there";


    const message =

        "Hello " +
        name +
        ". It is time to take your " +
        medicine.medicineName +
        ". Your dosage is " +
        medicine.dosage +
        ". Please take your medicine according to your doctor's instructions.";


    speakText(
        message
    );

}


// =====================================================
// SPEAK CURRENT REMINDER
// =====================================================

function speakCurrentReminder() {

    const medicineData =
        localStorage.getItem(
            "currentReminder"
        );


    if (!medicineData) {

        speakReminder();

        return;

    }


    try {

        const medicine =
            JSON.parse(
                medicineData
            );


        speakMedicineReminder(
            medicine
        );


    } catch (error) {

        console.error(
            "Speak current reminder error:",
            error
        );


        speakReminder();

    }

}


// =====================================================
// TEXT TO SPEECH
// =====================================================

function speakText(
    message
) {

    console.log(
        "Speaking:",
        message
    );


    if (
        !("speechSynthesis" in window)
    ) {

        alert(
            "Speech synthesis is not supported by this browser."
        );

        return;

    }


    const speech =
        new SpeechSynthesisUtterance(
            message
        );


    speech.lang =
        "en-US";


    speech.rate =
        0.9;


    speech.pitch =
        1;


    speech.volume =
        1;


    speech.onstart =
        function () {

            console.log(
                "🔊 VOICE STARTED"
            );

        };


    speech.onend =
        function () {

            console.log(
                "VOICE FINISHED"
            );

        };


    speech.onerror =
        function (event) {

            console.log(
                "VOICE ERROR:",
                event.error
            );

        };


    window.speechSynthesis.cancel();


    setTimeout(
        function () {

            window.speechSynthesis.speak(
                speech
            );

        },
        500
    );

}


// =====================================================
// TEST VOICE
// =====================================================

function testVoice() {

    console.log(
        "TEST VOICE CLICKED"
    );


    if (
        !("speechSynthesis" in window)
    ) {

        alert(
            "Speech synthesis is not supported by this browser."
        );

        return;

    }


    const speech =
        new SpeechSynthesisUtterance(
            "Hello. This is a voice test from the Smart Elderly Care Assistant."
        );


    speech.lang =
        "en-US";


    speech.rate =
        0.9;


    speech.pitch =
        1;


    speech.volume =
        1;


    speech.onstart =
        function () {

            console.log(
                "🔊 VOICE STARTED"
            );

        };


    speech.onend =
        function () {

            console.log(
                "VOICE FINISHED"
            );

        };


    speech.onerror =
        function (event) {

            console.log(
                "VOICE ERROR:",
                event.error
            );

        };


    window.speechSynthesis.cancel();


    setTimeout(
        function () {

            window.speechSynthesis.speak(
                speech
            );

        },
        500
    );

}


// =====================================================
// TEST MEDICINE NOTIFICATION
// =====================================================

function testMedicineNotification() {

    const testMedicine = {

        _id:
            "test-medicine",

        medicineName:
            "Paracetamol",

        dosage:
            "1 tablet",

        period:
            "Morning",

        time:
            "08:00"

    };


    showMedicineNotification(
        testMedicine
    );

}


// =====================================================
// BROWSER NOTIFICATION PERMISSION
// =====================================================

function requestNotificationPermission() {

    if (
        !("Notification" in window)
    ) {

        alert(
            "Browser notifications are not supported."
        );

        return;

    }


    Notification.requestPermission()
        .then(
            function (permission) {

                if (
                    permission ===
                    "granted"
                ) {

                    alert(
                        "🔔 Notifications enabled!"
                    );

                } else {

                    alert(
                        "Browser notifications were not allowed."
                    );

                }

            }
        );

}


// =====================================================
// BROWSER NOTIFICATION
// =====================================================

function showBrowserNotification(
    medicine
) {

    if (
        !("Notification" in window)
    ) {

        return;

    }


    if (
        Notification.permission !==
        "granted"
    ) {

        return;

    }


    try {

        new Notification(
            "🔔 Medicine Reminder",
            {

                body:
                    "It's time to take " +
                    medicine.medicineName +
                    ". Dosage: " +
                    medicine.dosage,

                icon:
                    ""

            }
        );

    } catch (error) {

        console.log(
            "Browser notification error:",
            error
        );

    }

}


// =====================================================
// DASHBOARD BUTTON
// =====================================================

function goDashboard() {

    window.location.href =
        "dashboard.html";

}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmLogout) {
        return;
    }


    localStorage.removeItem(
        "user"
    );


    localStorage.removeItem(
        "currentReminder"
    );


    window.location.href =
        "login.html";

}


// =====================================================
// ADD MEDICINE BUTTON
// =====================================================

function goToAddMedicine() {

    window.location.href =
        "medicine.html";

}


// =====================================================
// TODAY'S MEDICINE SCHEDULE
// =====================================================

// =====================================================
// TODAY'S MEDICINE SCHEDULE
// =====================================================

function showTodaySchedule(medicines) {

    const schedule =
        document.getElementById(
            "todaySchedule"
        );


    if (!schedule) {
        return;
    }


    if (
        !medicines ||
        medicines.length === 0
    ) {

        schedule.innerHTML =
            "<p>No medicines scheduled for today.</p>";

        return;
    }


    // Sort medicines by time

    medicines.sort(
        function (a, b) {

            return a.time.localeCompare(
                b.time
            );

        }
    );


    schedule.innerHTML = "";


    medicines.forEach(
        function (medicine) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "schedule-item";


            // Get current medicine status

            const status =
                getMedicineStatus(
                    medicine._id
                );


            let statusIcon = "🟡";

            if (status === "Taken") {
                statusIcon = "🟢";
            }

            else if (status === "Snoozed") {
                statusIcon = "🔵";
            }

            else if (status === "Missed") {
                statusIcon = "🔴";
            }


            item.innerHTML = `
                
                <div>
                    
                    <strong>
                        💊 ${medicine.medicineName}
                    </strong>

                    <p>
                        ${medicine.dosage}
                        •
                        ${medicine.period}
                    </p>

                    <p>
                        ${statusIcon}
                        <strong>${status}</strong>
                    </p>

                </div>


                <div class="schedule-time">
                    ⏰ ${medicine.time}
                </div>

            `;


            schedule.appendChild(
                item
            );

        }
    );

}
// =====================================================
// DISPLAY MISSED MEDICINE ALERTS
// =====================================================

function displayMissedMedicineAlerts(medicines) {

    const alertBox =
        document.getElementById(
            "missedMedicineAlerts"
        );

    if (!alertBox) {
        return;
    }

    const missedMedicines =
        medicines.filter(
            function (medicine) {

                return (
                    getMedicineStatus(
                        medicine._id
                    ) === "Missed"
                );

            }
        );


    // No missed medicines

    if (missedMedicines.length === 0) {

        alertBox.innerHTML =
            "<p>No missed medicines.</p>";

        return;
    }


    // Display missed medicines

    alertBox.innerHTML = "";


    missedMedicines.forEach(
        function (medicine) {

            const alert =
                document.createElement("div");

            alert.className =
                "missed-alert";

            const user =
    JSON.parse(
        localStorage.getItem("user")
    );

const caregiverName =
    user && user.caregiverName
        ? user.caregiverName
        : "Caregiver";

const caregiverEmail =
    user && user.caregiverEmail
        ? user.caregiverEmail
        : "Not available";

const caregiverPhone =
    user && user.caregiverPhone
        ? user.caregiverPhone
        : "Not available";


alert.innerHTML = `
    <strong>
        🚨 ${medicine.medicineName}
    </strong>

    <p>
        Dosage: ${medicine.dosage}
    </p>

    <p>
        Scheduled time: ${medicine.time}
    </p>

    <p>
        ⚠️ This medicine was missed.
    </p>

    <hr>

    <p>
        👨‍👩‍👧 Caregiver:
        <strong>${caregiverName}</strong>
    </p>

    <p>
        📞 Phone:
        <strong>${caregiverPhone}</strong>
    </p>

    <p>
        📢 Caregiver should be notified.
    </p>
`;


            alertBox.appendChild(alert);

        }
    );

}
