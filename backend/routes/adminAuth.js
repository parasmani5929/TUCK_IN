const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('../db');

// POST /api/admin/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const db = getDB();
    const existing = await db.collection('admin').findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered.' });

    const hashed = await bcrypt.hash(password, 12);
    await db.collection('admin').insertOne({ name, email, password: hashed });
    res.status(201).json({ message: 'Admin registered successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// POST /api/admin/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required.' });

    const db = getDB();
    const admin = await db.collection('admin').findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: admin._id.toString(), name: admin.name, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET || 'tuckin_jwt_secret',
      { expiresIn: '7d' }
    );
    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;
