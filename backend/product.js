const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Poultry', 'Livestock', 'Accessories', 'Feed', 'Other']
  },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  image: String,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    default: 'Available',
    enum: ['Available', 'Sold', 'Pending', 'Reserved']
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);