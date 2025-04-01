const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth, isSuperAdmin } = require('../middleware/auth');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    if (user.role === 'subAdmin' && user.requestStatus === 'pending') {
      return res.status(401).json({ error: 'Your account is pending approval' });
    }

    if (user.role === 'subAdmin' && user.requestStatus === 'rejected') {
      return res.status(401).json({ error: 'Your account has been rejected' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        requestStatus: user.requestStatus
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Register route (Public for first user, Super Admin only for subsequent users)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Check if this is the first user
    const userCount = await User.countDocuments();
    const isFirstUser = userCount === 0;

    let decoded = null;
    // If not the first user, require super admin authentication
    if (!isFirstUser) {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const adminUser = await User.findOne({ _id: decoded.id, role: 'superAdmin' });
        
        if (!adminUser) {
          return res.status(403).json({ error: 'Only super admins can register new users' });
        }
      } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
    }

    const user = new User({
      username,
      email,
      password,
      role: isFirstUser ? 'superAdmin' : (role || 'subAdmin'),
      requestStatus: isFirstUser ? 'approved' : 'pending',
      createdBy: isFirstUser ? null : decoded?.id
    });

    await user.save();

    res.status(201).json({
      message: isFirstUser ? 'Super admin created successfully' : 'Registration successful. Waiting for approval.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        requestStatus: user.requestStatus
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Get pending sub-admin requests (Super Admin only)
router.get('/pending-requests', auth, isSuperAdmin, async (req, res) => {
  try {
    const pendingUsers = await User.find({
      role: 'subAdmin',
      requestStatus: 'pending'
    }).select('-password');
    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update sub-admin request status (Super Admin only)
router.patch('/update-request-status/:id', auth, isSuperAdmin, async (req, res) => {
  try {
    const { requestStatus } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'subAdmin') {
      return res.status(400).json({ error: 'Can only update sub-admin requests' });
    }

    user.requestStatus = requestStatus;
    await user.save();

    res.json({
      message: 'Request status updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        requestStatus: user.requestStatus
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        requestStatus: req.user.requestStatus
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 