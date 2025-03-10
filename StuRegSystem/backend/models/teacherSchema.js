const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
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
        default: "Teacher"
    },
    profilePicture: {
        type: String,  // Stores the path or URL of the uploaded image
        default: "default-profile.png", // Default profile picture if none is uploaded
    }
}, { timestamps: true });

module.exports = mongoose.model("Teacher", teacherSchema);
