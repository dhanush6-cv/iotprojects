const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/iot_users', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePhoto: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// File Upload Setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

// REGISTER API
app.post('/register', upload.single('profilePhoto'), async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            profilePhoto: req.file ? req.file.filename : null
        });

        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, 'your-secret-key');

        res.status(201).json({
            message: 'Registration successful!',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePhoto: newUser.profilePhoto
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// LOGIN API
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, 'your-secret-key');

        res.json({
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePhoto: user.profilePhoto
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PROFILE PHOTO UPLOAD API
app.post('/upload-profile', upload.single('profilePhoto'), async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, 'your-secret-key');
        const userId = decoded.userId;

        // Update user profile photo
        await User.findByIdAndUpdate(userId, {
            profilePhoto: req.file.filename
        });

        res.json({
            message: 'Profile photo updated successfully',
            profilePhoto: req.file.filename
        });

    } catch (error) {
        res.status(500).json({ message: 'Error uploading profile photo' });
    }
});

// SERVER START
app.listen(5000, () => {
    console.log('🚀 Server running on port 5000');
    console.log('📧 Register API: http://localhost:5000/register');
    console.log('🔐 Login API: http://localhost:5000/login');
    console.log('📷 Profile Upload: http://localhost:5000/upload-profile');
});