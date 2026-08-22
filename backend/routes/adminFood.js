const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { ObjectId } = require('mongodb');
const { getDB } = require('../db');
const adminMiddleware = require('../middleware/adminMiddleware');

// ── Multer configuration ──────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_')),
});
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, png, webp, gif) are allowed.'), false);
  }
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// GET /api/admin/food  — list all food items (newest first)
router.get('/', adminMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const foods = await db.collection('food_items').find({}).sort({ _id: -1 }).toArray();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// POST /api/admin/food  — add new food item
router.post('/', adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'name, description, price and category are required.' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'An image file is required.' });
    }
    const db = getDB();
    const imagePath = 'uploads/' + req.file.filename;
    const result = await db.collection('food_items').insertOne({
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category: category.trim(),
      image: imagePath,
    });
    res.status(201).json({ message: 'Food item added successfully.', id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// PUT /api/admin/food/:id  — edit food item
router.put('/:id', adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const db = getDB();
    const updates = {};
    if (name) updates.name = name.trim();
    if (description) updates.description = description.trim();
    if (price) updates.price = parseFloat(price);
    if (category) updates.category = category.trim();
    if (req.file) updates.image = 'uploads/' + req.file.filename;

    const result = await db.collection('food_items').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updates }
    );
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Food item not found.' });
    res.json({ message: 'Food item updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// DELETE /api/admin/food/:id  — delete food item
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('food_items').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Food item not found.' });
    res.json({ message: 'Food item deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;
