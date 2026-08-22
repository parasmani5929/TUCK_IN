const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDB } = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/ratings/:foodId  — rate a food item (upsert — one per user per item)
router.post('/:foodId', authMiddleware, async (req, res) => {
  try {
    const ratingNum = parseInt(req.body.rating);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5.' });
    }

    const db = getDB();
    const food_id = new ObjectId(req.params.foodId);
    const user_id = new ObjectId(req.user.id);

    const existing = await db.collection('food_ratings').findOne({ food_id, user_id });

    if (existing) {
      await db.collection('food_ratings').updateOne(
        { _id: existing._id },
        { $set: { rating: ratingNum, name: req.user.name } }
      );
    } else {
      await db.collection('food_ratings').insertOne({
        food_id,
        user_id,
        rating: ratingNum,
        name: req.user.name,
      });
    }

    // Calculate average rating for this food item
    const all = await db.collection('food_ratings').find({ food_id }).toArray();
    const avg = all.reduce((sum, r) => sum + r.rating, 0) / all.length;

    res.json({
      message: `Thank you, ${req.user.name}! Your ${ratingNum}-star rating has been saved.`,
      average: avg.toFixed(1),
      count: all.length,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET /api/ratings/:foodId  — get rating summary for a food item
router.get('/:foodId', async (req, res) => {
  try {
    const db = getDB();
    const food_id = new ObjectId(req.params.foodId);
    const all = await db.collection('food_ratings').find({ food_id }).toArray();
    const avg = all.length > 0 ? all.reduce((sum, r) => sum + r.rating, 0) / all.length : 0;
    res.json({ average: avg.toFixed(1), count: all.length, ratings: all });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;
