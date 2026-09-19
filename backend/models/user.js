const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    dob: String,

    email: {
        type: String,
        required: true,
        unique: true
    },

    phone: String,

    password: {
        type: String,
        required: true
    },

    bloodGroup: String,
    conditions: String,
    allergies: String,

    caregiverName: String,
    caregiverEmail: String,
    relationship: String,
    caregiverPhone: String
});

module.exports =
    mongoose.models.User ||
    mongoose.model("User", userSchema);