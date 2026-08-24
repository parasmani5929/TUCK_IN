const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDB } = require('../db');
const adminMiddleware = require('../middleware/adminMiddleware');

const VALID_STATUSES = ['Pending', 'Paid', 'Preparing', 'On the Way', 'Out for Delivery', 'Delivered', 'Completed'];

// GET /api/admin/orders  — all orders, enriched with user & food names
router.get('/', adminMiddleware, async (req, res) => {
  try {
    const db = await getDB();
    const orders = await db.collection('orders').find({}).sort({ order_date: -1 }).toArray();

    // Enrich orders with user name and food names (batched)
    const enriched = await Promise.all(
      orders.map(async (order) => {
        const user = await db.collection('users').findOne(
          { _id: order.user_id },
          { projection: { name: 1, email: 1 } }
        );
        const items = await Promise.all(
          order.items.map(async (item) => {
            const food = await db.collection('food_items').findOne(
              { _id: item.food_id },
              { projection: { name: 1 } }
            );
            return { ...item, food_name: food ? food.name : 'Unknown Item' };
          })
        );
        return {
          ...order,
          user_name: user ? user.name : 'Unknown User',
          user_email: user ? user.email : '',
          items,
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// PUT /api/admin/orders/:id/status  — update order status (with whitelist validation)
router.put('/:id/status', adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status value.',
        valid_statuses: VALID_STATUSES,
      });
    }

    const db = await getDB();
    const result = await db.collection('orders').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status } }
    );
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Order not found.' });
    res.json({ message: `Order status updated to "${status}".`, status });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;
