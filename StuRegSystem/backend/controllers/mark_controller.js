
const Mark = require('../models/markSchema.js');

// Get all marks
exports.getAllMarks = async (req, res) => {
  try {
    const marks = await Mark.find();
    res.status(200).json(marks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching marks!', error });
  }
};

// Get marks for a specific student
exports.getMarksByStudentId = async (req, res) => {
  const { studentId } = req.params;
  
  try {
    const studentMarks = await Mark.findOne({ studentId });
    
    if (!studentMarks) {
      return res.status(404).json({ message: 'No marks found for this student!' });
    }

    res.status(200).json(studentMarks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching marks!', error });
  }
};

// Add multiple subjects for a student
exports.addMarks = async (req, res) => {
  const { studentId, marks } = req.body; // Marks should be an array of { subject, score }

  try {
    let studentMarks = await Mark.findOne({ studentId });

    if (!studentMarks) {
      // Create new entry if student doesn't exist
      studentMarks = new Mark({ studentId, marks });
    } else {
      // Add new subjects or update existing ones
      marks.forEach(newMark => {
        const existingSubject = studentMarks.marks.find(m => m.subject === newMark.subject);
        if (existingSubject) {
          existingSubject.score = newMark.score; // Update score if subject exists
        } else {
          studentMarks.marks.push(newMark); // Add new subject
        }
      });
    }

    await studentMarks.save();
    res.status(201).json({ message: 'Marks added successfully!', marks: studentMarks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding marks!', error });
  }
};

exports.updateMarks = async (req, res) => {
  const { studentId, subject } = req.params;
  let { score } = req.body;

  try {
    if (!score || isNaN(score) || score < 0 || score > 100) {
      return res.status(400).json({ message: "Invalid score! Must be between 0 and 100." });
    }

    score = Number(score);

    const updatedStudent = await Mark.findOneAndUpdate(
      { studentId, "marks.subject": subject }, 
      { $set: { "marks.$.score": score } }, 
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student or subject not found!" });
    }

    return res.status(200).json({ message: "Marks updated successfully!", marks: updatedStudent });
  } catch (error) {
    console.error("Error updating marks:", error);
    return res.status(500).json({ message: "Error updating marks!", error });
  }
};

// Delete a specific subject's marks for a student
exports.deleteMarks = async (req, res) => {
  const { studentId, subject } = req.params;

  try {
    const studentMarks = await Mark.findOne({ studentId });

    if (!studentMarks) {
      return res.status(404).json({ message: 'Student not found!' });
    }

    studentMarks.marks = studentMarks.marks.filter(m => m.subject !== subject);

    await studentMarks.save();
    res.status(200).json({ message: 'Marks deleted successfully!', marks: studentMarks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting marks!', error });
  }
};
