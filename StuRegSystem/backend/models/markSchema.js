const mongoose = require('mongoose');

// Define the Marks schema
const marksSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  marks: [
    {
      subject: {
        type: String,
        required: true,
      },
      score: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
    },
  ],
}, { timestamps: true });

// Create the Marks model
module.exports = mongoose.model('Mark', marksSchema);
