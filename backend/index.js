const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Order = require('./Order');
const VetQuestion = require('./VetQuestion');
const Product = require('./Product');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Bamenda Livestock Shop Backend is running!');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
const User = require('./User');

// Signup route
app.post('/api/signup', async (req, res) => {
  try {
    const { name, phone, location, password } = req.body;
    // Check if user exists
    const existing = await User.findOne({ phone });
    if (existing) return res.status(400).json({ message: 'Phone already registered' });
    // Create user
    const user = new User({ name, phone, location, password });
    await user.save();
    res.json({ message: 'User created', user });
  } catch (err) {
    res.status(500).json({ message: 'Signup error', error: err });
  }
});

// Signin route
app.post('/api/signin', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone, password });
    if (!user) return res.status(400).json({ message: 'Invalid phone or password' });
    res.json({ message: 'Signin successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Signin error', error: err });
  }
});
// Place order
app.post('/api/order', async (req, res) => {
  try {
    const { userId, items, total } = req.body;
    const order = new Order({ user: userId, items, total });
    await order.save();
    res.json({ message: 'Order placed', order });
  } catch (err) {
    res.status(500).json({ message: 'Order error', error: err });
  }
});
// Ask a vet
app.post('/api/ask-vet', async (req, res) => {
  try {
    const { name, phone, question } = req.body;
    const vetQ = new VetQuestion({ name, phone, question });
    await vetQ.save();
    res.json({ message: 'Question submitted', vetQ });
  } catch (err) {
    res.status(500).json({ message: 'Vet question error', error: err });
  }
});
// Get all users
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get all orders (with user info)
app.get('/api/orders', async (req, res) => {
  const orders = await Order.find().populate('user');
  res.json(orders);
});

// Get all vet questions
app.get('/api/vet-questions', async (req, res) => {
  const vetQs = await VetQuestion.find();
  res.json(vetQs);
});
// Get all products
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Add a new product
// Add a new product (user listing)
app.post('/api/products', async (req, res) => {
  try {
    const { name, category, price, description, image, seller, location } = req.body;
    const product = new Product({ name, category, price, description, image, seller, location });
    await product.save();
    res.json({ message: 'Product added', product });
  } catch (err) {
    res.status(500).json({ message: 'Add product error', error: err });
  }
});

// Edit a product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, category, price, description, image } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, price, description, image },
      { new: true }
    );
    res.json({ message: 'Product updated', product });
  } catch (err) {
    res.status(500).json({ message: 'Edit product error', error: err });
  }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete product error', error: err });
  }
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));