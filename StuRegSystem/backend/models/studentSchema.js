const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "Student"
    },
    profilePicture: {
        type: String,  // This will store the URL or path of the uploaded image
        default: "default-profile.png", // Set a default profile picture if none is uploaded
    }
});

module.exports = mongoose.model("Student", studentSchema);
