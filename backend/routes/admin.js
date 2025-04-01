const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, isSuperAdmin } = require('../middleware/auth');

// Get all sub-admins (Super Admin only)
router.get('/sub-admins', auth, isSuperAdmin, async (req, res) => {
  try {
    const subAdmins = await User.find({ role: 'subAdmin' })
      .select('-password')
      .populate('createdBy', 'username email');
    
    res.json(subAdmins);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update sub-admin status (Super Admin only)
router.patch('/sub-admins/:id/status', auth, isSuperAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    const subAdmin = await User.findOne({ 
      _id: req.params.id,
      role: 'subAdmin'
    });

    if (!subAdmin) {
      return res.status(404).json({ error: 'Sub-admin not found' });
    }

    subAdmin.isActive = isActive;
    await subAdmin.save();

    res.json({
      message: 'Sub-admin status updated successfully',
      subAdmin: {
        id: subAdmin._id,
        username: subAdmin.username,
        email: subAdmin.email,
        isActive: subAdmin.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete sub-admin (Super Admin only)
router.delete('/sub-admins/:id', auth, isSuperAdmin, async (req, res) => {
  try {
    const subAdmin = await User.findOneAndDelete({
      _id: req.params.id,
      role: 'subAdmin'
    });

    if (!subAdmin) {
      return res.status(404).json({ error: 'Sub-admin not found' });
    }

    res.json({ message: 'Sub-admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 