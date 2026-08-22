const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDB } = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/food  — list all food items, optional ?search=
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    let query = {};
    if (req.query.search) {
      query = { name: { $regex: req.query.search, $options: 'i' } };
    }
    const foods = await db.collection('food_items').find(query).toArray();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// POST /api/food/rate — submit a rating for a food item
router.post('/rate', authMiddleware, async (req, res) => {
  try {
    const { food_id, rating } = req.body;
    const db = getDB();
    
    // In a real app, you might track ratings per user in a 'food_ratings' collection
    // Here we'll just update the food_items collection with a simple average logic
    const food = await db.collection('food_items').findOne({ _id: new ObjectId(food_id) });
    if (!food) return res.status(404).json({ message: 'Food item not found' });

    const totalRatings = (food.totalRatings || 0) + 1;
    const currentTotalScore = (food.avgRating || 0) * (food.totalRatings || 0);
    const newAvg = (currentTotalScore + rating) / totalRatings;

    await db.collection('food_items').updateOne(
      { _id: new ObjectId(food_id) },
      { $set: { avgRating: newAvg, totalRatings: totalRatings } }
    );

    // Also insert into food_ratings collection as a log
    await db.collection('food_ratings').insertOne({
      food_id: new ObjectId(food_id),
      user_id: new ObjectId(req.user.id),
      rating: rating,
      created_at: new Date()
    });

    res.json({ message: 'Rating submitted successfully', avgRating: newAvg, totalRatings });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET /api/food/:id — single food item
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const food = await db.collection('food_items').findOne({ _id: new ObjectId(req.params.id) });
    if (!food) return res.status(404).json({ message: 'Food item not found.' });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;
