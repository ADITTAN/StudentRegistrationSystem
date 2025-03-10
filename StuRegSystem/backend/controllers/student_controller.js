const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken'); // For generating JWT token
const Student = require('../models/studentSchema.js');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Upload folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Student Registration (with email & ID uniqueness check + profile picture upload)
const studentRegister = async (req, res) => {
    const { id, name, email, password, role } = req.body;
    const profilePicture = req.file ? req.file.path : "/uploads/default.png"; // Default profile picture

    try {
        const existingStudentByEmail = await Student.findOne({ email });
        if (existingStudentByEmail) {
            return res.status(400).send({ message: 'Email already exists' });
        }

        const existingStudentById = await Student.findOne({ id });
        if (existingStudentById) {
            return res.status(400).send({ message: 'ID already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const student = new Student({
            id,
            name,
            email,
            password: hashedPass,
            role,
            profilePicture
        });

        let result = await student.save();
        res.send({ message: "Registration successful!" });
    } catch (err) {
        res.status(500).json({ message: "Error during registration", error: err });
    }
};

const studentLogIn = async (req, res) => {
    try {
        const student = await Student.findOne({ email: req.body.email });
        if (student) {
            // Compare the password
            const validated = await bcrypt.compare(req.body.password, student.password);
            if (validated) {
                student.password = undefined;  // Remove password before sending response
                res.send(student);  // Send student data on successful login
            } else {
                res.status(400).send({ message: "Invalid password" });
            }
        } else {
            res.status(404).send({ message: "Student not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error during login", error: err.message });
    }
};

// Update Student by ID (including profile picture)
const updateStudent = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const updates = { name, email, role };

        // Handle profile picture update
        if (req.file) {
            updates.profilePicture = req.file.path;
        }

        // Check if student exists before updating
        const existingStudent = await Student.findOne({ id: req.params.id });
        if (!existingStudent) {
            return res.status(404).send({ message: "Student not found" });
        }

        // Update student record
        const updatedStudent = await Student.findOneAndUpdate(
            { id: req.params.id }, // Find student by ID in the database
            { $set: updates },
            { new: true } // Return the updated student
        );

        res.send({
            message: "Student updated successfully",
            student: updatedStudent
        });
    } catch (err) {
        res.status(500).json({ message: "Error updating student", error: err.message });
    }
};

// Delete Student by ID
const deleteStudent = async (req, res) => {
    try {
        const deletedStudent = await Student.findOneAndDelete({ id: req.params.id });

        if (!deletedStudent) {
            return res.status(404).send({ message: "Student not found" });
        }

        res.send({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting student", error: err });
    }
};

module.exports = {
    studentRegister,
    studentLogIn,
    updateStudent,
    deleteStudent,
    upload
};
