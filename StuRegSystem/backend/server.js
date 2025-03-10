// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // To use environment variables




const app = express();
// Middleware

app.use(express.json()); // For parsing application/json
app.use(cors());



const myRoutes = require('./routes/route');

app.use('/api', myRoutes);

// MongoDB Connection
const MONGODB_URI = 'mongodb://localhost:27017/school';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Sample Route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Start server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


