

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// In teacher-controller.js
const upload = require('../config/multerConfig'); // Import the shared 'upload'

const {
  studentRegister,
   studentLogIn,
    updateStudent, 
    deleteStudent
     } = require('../controllers/student_controller.js');





const { teacherRegister, teacherLogIn, getTeachers, getTeacherDetail,  deleteTeacher, updateTeacher} = require('../controllers/teacher-controller.js');

const { getAllMarks,addMarks, updateMarks, deleteMarks, getMarksByStudentId } = require('../controllers/mark_controller.js');




router.post('/StudentReg', upload.single('profilePicture'), studentRegister); // Register with profile pic
router.post('/StudentLogin', studentLogIn);
router.put('/Student/:id', upload.single('profilePicture'), updateStudent); // Update with profile pic
router.delete('/Student/:id', deleteStudent);



//router.post('/StudentReg', studentRegister);
//router.post('/StudentLogin', studentLogIn)

//router.get("/Students/:id", getStudents)
//router.get("/Student/:id", getStudentDetail)

//router.delete("/Student/:id", deleteStudent)

//router.put("/Student/:id", updateStudent)


//router.post('/TeacherReg', teacherRegister);
//router.post('/TeacherLogin', teacherLogIn)

//router.get("/Teachers/:id", getTeachers)
//router.get("/Teacher/:id", getTeacherDetail)


//router.delete("/Teacher/:id", deleteTeacher)

//router.put("/Teacher/:id", updateTeacher)

// Teacher Registration (with profile picture upload)
router.post('/TeacherReg', upload.single('profilePicture'), teacherRegister);

// Teacher Login
router.post('/TeacherLogin', teacherLogIn);

// Update Teacher (with profile picture upload)
router.put('/Teacher/:id', upload.single('profilePicture'), updateTeacher);

// Delete Teacher by ID
router.delete('/Teacher/:id', deleteTeacher);

router.get('/', getAllMarks)

router.get('/marks/:studentId',getMarksByStudentId)
// Route to add marks
router.post('/marks', addMarks);

// Route to update marks by marksId
router.put('/marks/:studentId/:subject', updateMarks);

// Route to delete marks by marksId
router.delete('/marks/:studentId/:subject', deleteMarks);


router.get('/test-connection', async (req, res) => {
    try {
      // Try to fetch something from MongoDB (optional)
      // Just a basic test to confirm the connection is alive
      const connectionStatus = await mongoose.connection.readyState;
  
      if (connectionStatus === 1) {
        res.status(200).json({
          message: 'MongoDB connection is successful',
          status: 'Connected',
        });
      } else {
        res.status(500).json({
          message: 'MongoDB connection is not established',
          status: 'Not Connected',
        });
      }
    } catch (error) {
      res.status(500).json({
        message: 'Error checking MongoDB connection',
        error: error.message,
      });
    }
});  
module.exports = router;