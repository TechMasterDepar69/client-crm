const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// 1.Register a new user
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Create User
        const user = await User.create({ email, password });

        // Issue Token 
        const token = jwt.sign({ id: user._id }, 'secretkey123', { expiresIn: '1d' });
        res.status(201).json({ success: true, token });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// 2.Login an existing user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        // Issue Token
        const token = jwt.sign({ id: user._id }, 'secretkey123', { expiresIn: '1d' });

        res.status(200).json({ success: true, token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;