const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDB } = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const { sendEmail } = require('../utils/sendEmail');

// POST /api/orders  — place a new order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { cart, payment_method, review } = req.body;
    // cart: [{ food_id: string, quantity: number }]
    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }
    if (!['upi', 'cod'].includes(payment_method)) {
      return res.status(400).json({ message: 'Payment method must be "upi" or "cod".' });
    }

    const db = await getDB();
    let total_price = 0;
    const items = [];

    for (const item of cart) {
      const food = await db.collection('food_items').findOne({ _id: new ObjectId(item.food_id) });
      if (!food) return res.status(404).json({ message: `Food item not found: ${item.food_id}` });
      total_price += food.price * item.quantity;
      items.push({
        food_id: new ObjectId(item.food_id),
        quantity: item.quantity,
        price: food.price,
        name: food.name,
      });
    }

    const order = {
      user_id: new ObjectId(req.user.id),
      total_price,
      order_date: new Date(),
      status: 'Pending',
      payment_method,
      items,
      review: review || '',
    };

    const result = await db.collection('orders').insertOne(order);
    const orderId = result.insertedId;

    // Send confirmation email for COD orders
    if (payment_method === 'cod') {
      const user = await db.collection('users').findOne({ _id: new ObjectId(req.user.id) });
      if (user) {
        sendEmail({
          to: user.email,
          subject: `Order Confirmation — Order #${orderId}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;">
              <h2 style="color:#ff6b35;">🎉 Order Placed Successfully!</h2>
              <p>Hi <strong>${user.name}</strong>, your order has been placed.</p>
              <p><strong>Order ID:</strong> #${orderId}</p>
              <p><strong>Total:</strong> ₹${total_price}</p>
              <p><strong>Payment:</strong> Cash on Delivery</p>
              <p>Thank you for ordering from TuckIN! 🍕</p>
            </div>`,
        }).catch(console.error);
      }
    }

    res.status(201).json({ order_id: orderId, total_price, payment_method });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET /api/orders/my-orders  — all orders for logged in user
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const db = await getDB();
    const orders = await db
      .collection('orders')
      .find({ user_id: new ObjectId(req.user.id) })
      .sort({ order_date: -1 })
      .toArray();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET /api/orders/track  — latest order for logged in user
router.get('/track', authMiddleware, async (req, res) => {
  try {
    const db = await getDB();
    const order = await db
      .collection('orders')
      .find({ user_id: new ObjectId(req.user.id) })
      .sort({ order_date: -1 })
      .limit(1)
      .next();
    if (!order) return res.status(404).json({ message: 'No orders found.' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET /api/orders/:id  — get order by id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const db = await getDB();
    const order = await db.collection('orders').findOne({ _id: new ObjectId(req.params.id) });
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// POST /api/orders/:id/verify-payment  — mark UPI order as paid + send email
router.post('/:id/verify-payment', authMiddleware, async (req, res) => {
  try {
    const db = await getDB();
    const order = await db.collection('orders').findOne({ _id: new ObjectId(req.params.id) });
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    await db.collection('orders').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: 'Paid' } }
    );

    // Send payment confirmation email
    const user = await db.collection('users').findOne({ _id: order.user_id });
    if (user) {
      sendEmail({
        to: user.email,
        subject: `Payment Confirmation — Order #${req.params.id}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;">
            <h2 style="color:#ff6b35;">🎉 Payment Successful!</h2>
            <p>Hi <strong>${user.name}</strong>, your payment has been received.</p>
            <p><strong>Order ID:</strong> #${req.params.id}</p>
            <p><strong>Amount Paid:</strong> ₹${order.total_price}</p>
            <p>Your food is being prepared! 🍕</p>
          </div>`,
      }).catch(console.error);
    }

    res.json({ message: 'Payment verified. Order status updated to Paid.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;
