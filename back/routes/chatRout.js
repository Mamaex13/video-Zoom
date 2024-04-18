const express = require('express');
const router = express.Router();
const { UserModel, CallHistory } = require('../models/chatModel');
const multer = require('multer');
const { v4: uuidV4 } = require('uuid');
const path = require('path');

const PORT = process.env.PORT || 5000; // Define PORT

// Define Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

//signup.................................................................................
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await UserModel.findOne({ email });

    if (user) {
      // User already exists, send error response
      console.log('Email already exists');
      return res.status(400).json({ error: 'Email already exists' });
    }

    // User does not exist, proceed with registration
    user = await UserModel.create({ email, password });
    
    // Send back the newly created user object in the response
    res.status(201).json(user);
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

//login.............................................................................................
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user || user.password !== password) {
      // If user not found or password doesn't match, return error
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Password matches, login successful, return user type along with success message
    res.json({ message: 'Login successful', usertype: user.usertype });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

router.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});




router.post('/call-history', async (req, res) => {
  try {
    const callHistoryData = req.body;
    const callHistory = await CallHistory.create(callHistoryData);
    res.status(201).json(callHistory);
  } catch (error) {
    console.error('Error storing call history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define route to fetch call history data
router.get('/call-history', async (req, res) => {
  try {
    const callHistory = await CallHistory.find();
    res.status(200).json(callHistory);
  } catch (error) {
    console.error('Error fetching call history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
