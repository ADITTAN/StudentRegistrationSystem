const bcrypt = require('bcrypt');
const Teacher = require('../models/teacherSchema.js');
const multer = require('multer');
const path = require('path');

// Configure Multer for profile picture uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Upload folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Teacher Registration (with email & ID uniqueness check + profile picture upload)
const teacherRegister = async (req, res) => {
    const { id, name, email, password, role } = req.body;
    const profilePicture = req.file ? req.file.path : "/uploads/default-profile.png"; // Store uploaded file path

    try {
        // Check if email already exists
        const existingTeacherByEmail = await Teacher.findOne({ email });
        if (existingTeacherByEmail) {
            return res.status(400).send({ message: 'Email already exists' });
        }

        // Check if ID already exists
        const existingTeacherById = await Teacher.findOne({ id });
        if (existingTeacherById) {
            return res.status(400).send({ message: 'ID already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        // Create a new teacher instance
        const teacher = new Teacher({
            id,
            name,
            email,
            password: hashedPass,
            role,
            profilePicture
        });

        // Save teacher to database
        let result = await teacher.save();
        result.password = undefined; // Remove password from response

        res.send(result);
    } catch (err) {
        res.status(500).json({ message: "Error during registration", error: err });
    }
};

// Teacher Login (email & password authentication)
const teacherLogIn = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ email: req.body.email });
        if (teacher) {
            const validated = await bcrypt.compare(req.body.password, teacher.password);
            if (validated) {
                teacher.password = undefined;
                res.send(teacher);
            } else {
                res.status(400).send({ message: "Invalid password" });
            }
        } else {
            res.status(404).send({ message: "Teacher not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error during login", error: err });
    }
};

// Update Teacher by ID (including profile picture)
const updateTeacher = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const updates = { name, email, role };

        // Handle profile picture update
        if (req.file) {
            updates.profilePicture = req.file.path;
        }

        // Check if the teacher exists before updating
        const existingTeacher = await Teacher.findOne({ id: req.params.id });
        if (!existingTeacher) {
            return res.status(404).send({ message: "Teacher not found" });
        }

        // Update teacher record
        const updatedTeacher = await Teacher.findOneAndUpdate(
            { id: req.params.id }, // Find teacher by ID in the database
            { $set: updates },
            { new: true } // Return the updated teacher
        );

        updatedTeacher.password = undefined; // Ensure password is not included in the response
        res.send({
            message: "Teacher updated successfully",
            teacher: updatedTeacher
        });
    } catch (err) {
        res.status(500).json({ message: "Error updating teacher", error: err.message });
    }
};

// Delete Teacher by ID
const deleteTeacher = async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findOneAndDelete({ id: req.params.id });

        if (!deletedTeacher) {
            return res.status(404).send({ message: "Teacher not found" });
        }

        res.send({ message: "Teacher deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting teacher", error: err });
    }
};


module.exports = {
    teacherRegister,
    teacherLogIn,
    updateTeacher,
    deleteTeacher,
    upload // Export Multer upload for route usage
};
