const express = require('express');
const cors = require('cors'); // Import CORS
const authRoutes = require('./routes/auth.routes');
const db = require('./config/db');

const app = express();
app.use(express.json());

// Enable CORS for frontend (http://localhost:3002)
app.use(cors({
  origin: 'http://localhost:3002', // Allow requests from frontend
   methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
  // Allow cookies/auth headers if needed
}));

app.use('/api/auth', authRoutes);

module.exports = app;
