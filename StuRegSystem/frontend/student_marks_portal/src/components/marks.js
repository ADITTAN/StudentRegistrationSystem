import React, { useState } from "react";
import API from '../api/axiosConfig';
import "./marks.css";

const MarksManagement = () => {
  const [studentId, setStudentId] = useState("");
  const [marks, setMarks] = useState([{ subject: "", score: "" }]);
  const [studentMarks, setStudentMarks] = useState(null);

  // Handle Student ID change
  const handleStudentIdChange = (e) => {
    setStudentId(e.target.value);
    setStudentMarks(null); // Clear previous marks
  };

  // Fetch student marks when "Search Student" button is clicked
  const handleSearchStudent = async () => {
    if (!studentId.trim()) {
      alert("Please enter a Student ID.");
      return;
    }

    try {
      const response = await API.get(`/marks/${studentId}`);
      setStudentMarks(response.data);
    } catch (error) {
      console.error("Error fetching marks:", error);
      setStudentMarks(null);
      alert("Student not found!");
    }
  };

  // Handle changes in marks input fields
  const handleMarksChange = (index, field, value) => {
    const newMarks = [...marks];
    newMarks[index][field] = value;
    setMarks(newMarks);
  };

  // Add a new mark field
  const addMarkField = () => {
    setMarks([...marks, { subject: "", score: "" }]);
  };

  // Remove a mark field
  const removeMarkField = (index) => {
    const newMarks = marks.filter((_, i) => i !== index);
    setMarks(newMarks);
  };

  // Submit marks and refresh the page
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/marks", { studentId, marks });
      alert("Marks added successfully!");
      setMarks([{ subject: "", score: "" }]); // Reset form
      handleSearchStudent(); // Refresh marks after adding
    } catch (error) {
      console.error("Error adding marks:", error);
    }
  };

  // Update a specific subject's marks
  const handleUpdate = async (subject, newScore) => {
    try {
      await API.put(`/marks/${studentId}/${subject}`, { score: newScore });
      alert("Marks updated successfully!");
      handleSearchStudent(); // Refresh marks after updating
    } catch (error) {
      console.error("Error updating marks:", error);
    }
  };

  // Delete a specific subject's marks
  const handleDelete = async (subject) => {
    try {
      await API.delete(`/marks/${studentId}/${subject}`);
      alert("Marks deleted successfully!");
      handleSearchStudent(); // Refresh marks after deletion
    } catch (error) {
      console.error("Error deleting marks:", error);
    }
  };

  return (
    <div className="marks-container">
      <h2>Manage Student Marks</h2>

      {/* Student ID input and Search button */}
      <div className="student-search">
        <input
          type="text"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={handleStudentIdChange}
        />
        <button onClick={handleSearchStudent}>Search Student</button>
      </div>

      {/* Form for adding marks */}
      <form onSubmit={handleSubmit} className="marks-form">
        {marks.map((mark, index) => (
          <div key={index} className="mark-input">
            <input
              type="text"
              placeholder="Subject"
              value={mark.subject}
              onChange={(e) => handleMarksChange(index, "subject", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Score"
              value={mark.score}
              onChange={(e) => handleMarksChange(index, "score", e.target.value)}
              required
            />
            <button type="button" onClick={() => removeMarkField(index)}>X</button>
          </div>
        ))}
        <button type="button" onClick={addMarkField}>+ Add Subject</button>
        <button type="submit">Submit Marks</button>
      </form>

      {/* Display marks after fetching */}
      {studentMarks && (
        <div className="marks-table">
          <h3>Marks for Student ID: {studentId}</h3>
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Score</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {studentMarks.marks.map((mark, index) => (
                <tr key={index}>
                  <td>{mark.subject}</td>
                  <td>
                    <input
                      type="number"
                      defaultValue={mark.score}
                      onBlur={(e) => handleUpdate(mark.subject, e.target.value)}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleUpdate(mark.subject, mark.score)}>
                      Update
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(mark.subject)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MarksManagement;
